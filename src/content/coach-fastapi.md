# FastAPI 백엔드 실전 패턴

DB·CRUD·검증을 직접 만드는 백엔드 — "백엔드를 백엔드 없이" 하는 Supabase 실전 패턴의 반대편 짝. 직접 서버를 들고 가야 할 때 막히는 지점만 모았습니다. (전체 코스는 강의 [9장 · FastAPI 백엔드 완성](/lesson/ai-09) 참고)

> ℹ️ 언제 이 패턴인가 — 인증·간단 저장은 Supabase(→ "Supabase 실전 패턴")로 충분하지만, **복잡한 도메인 로직·서버사이드 검증·외부 시스템 연동·모델 추론 결합**이 필요하면 FastAPI 백엔드를 직접 세웁니다. AI 트랙 1~8장의 모델 서빙에 이 패턴을 얹으면 사용자·데이터·과금을 갖춘 진짜 서비스가 됩니다.

## 1. 폴더 구조 — 처음부터 분리해 둔다

파일 하나(`main.py`)에 다 몰면 200줄부터 무너집니다. 처음부터 역할별로 나눕니다.

```text
project/
├── main.py        # 진입점: 라우터 등록 · CORS · 테이블 생성
├── database.py    # 연결 설정: engine · SessionLocal · get_db
├── models.py      # SQLAlchemy ORM (DB 테이블 구조)
├── schemas.py     # Pydantic (API 입출력 형식)
├── routers/       # 라우팅(요청·응답)만
└── crud/          # DB 조작 로직만 (Repository)
```

> ℹ️ 핵심 분리 한 줄 — `models.py`(DB가 어떻게 저장하나)와 `schemas.py`(API가 무엇을 주고받나)는 **다른 파일**이다. 둘을 섞으면 "응답에 비밀번호가 새는" 사고가 난다.

## 2. 스키마는 Create와 Response를 나눈다 (보안 패턴)

입력으로는 비밀번호를 받되, 응답에는 절대 포함하지 않습니다. 스키마를 나누면 이게 **구조적으로** 보장됩니다.

```python
class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=20)
    email: EmailStr                       # 형식 자동 검증
    password: str = Field(..., min_length=8)

class UserResponse(BaseModel):
    id: int
    username: str
    email: str                            # password 없음 → 응답에 안 샌다
    model_config = {"from_attributes": True}
```

라우터에 `response_model=UserResponse`를 걸면, 함수가 비밀번호를 가진 ORM 객체를 그대로 반환해도 FastAPI가 스키마에 없는 필드를 잘라냅니다.

> ⚠️ **주의** 검증 실패는 422로 자동 응답된다 — `if` 검증 코드를 직접 쓰지 말 것. `min_length`·`gt`·`EmailStr`·`field_validator`로 선언하면 끝. 직접 검증을 덧붙이면 메시지가 이중으로 나가고 유지보수가 깨진다.

## 3. DB 세션은 Depends(get_db)로 — 세션 누수 봉쇄

세션을 라우터마다 직접 열고 닫으면 반드시 어딘가에서 안 닫힙니다. 제너레이터 + 의존성 주입으로 구조가 강제하게 합니다.

```python
# database.py
def get_db():
    db = SessionLocal()
    try:
        yield db          # 요청 처리에 세션 제공
    finally:
        db.close()        # 응답 후 무조건 정리

# routers/item.py
@router.get("/", response_model=list[schemas.ItemResponse])
def list_items(db: Session = Depends(get_db)):
    return crud.get_items(db)
```

## 4. Repository 패턴 — 라우터는 얇게, crud는 두껍게

라우터는 "받고 돌려주기"만, 실제 DB 조작은 `crud/`가 합니다. 테스트·재사용·교체가 쉬워집니다.

```python
# crud/user_crud.py — DB 로직
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_user(db: Session, user: UserCreate):
    hashed = pwd_context.hash(user.password)   # 평문 저장 금지
    db_user = User(username=user.username, email=user.email, password=hashed)
    db.add(db_user); db.commit(); db.refresh(db_user)
    return db_user

# routers/user.py — 얇은 라우터
@router.post("/", response_model=schemas.UserResponse, status_code=201)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if crud.get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="이미 등록된 이메일입니다")
    return crud.create_user(db, user)
```

> ℹ️ 비밀번호는 무조건 해싱 — bcrypt로 해시한 값만 저장한다. (→ "AI API Key 안전 수칙"과 같은 원칙: 비밀은 평문으로 두지 않는다)

## 5. 상태 코드를 의미대로 쓴다

| 상태 코드 | 언제 |
| --- | --- |
| 200 | 조회·수정 성공 |
| 201 | 생성 성공(POST) |
| 204 | 삭제 성공(본문 없음) |
| 400 | 비즈니스 오류(중복 이메일 등) |
| 404 | 없는 리소스 조회 |
| 422 | 입력 검증 실패(Pydantic 자동) |

생성은 `status_code=201`, 삭제는 `204`, 없으면 `HTTPException(404)`. "다 200으로 주는" API는 프론트가 성공/실패를 구분 못 합니다.

## 6. React 연동 — CORS는 한 번만 켜면 끝

출처가 다른 React(3000)→FastAPI(8000) 요청은 브라우저가 막습니다. `main.py`에 미들웨어 한 번이면 됩니다.

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],   # 프론트 주소
    allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)
```

> ⚠️ **주의** 운영 배포 시 `allow_origins`를 실제 도메인으로 바꾼다. `["*"]` + `allow_credentials=True` 조합은 브라우저가 거부하므로 출처를 명시할 것.

## 7. 테스트는 TestClient로 — 서버를 안 띄우고 검증

```python
from fastapi.testclient import TestClient
from main import app
client = TestClient(app)

def test_create_user():
    r = client.post("/users", json={"username": "testuser",
        "email": "test@example.com", "password": "securepass123"})
    assert r.status_code == 201
    assert "password" not in r.json()    # 응답에 비밀번호 미노출까지 검증
```

마지막 한 줄이 보안 설계(2번 패턴)가 실제로 지켜지는지를 회귀 테스트로 못 박습니다.

## 8. 배포는 Dockerfile로 — 어디서나 동일하게

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt   # 의존성 먼저(캐시)
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

`requirements.txt`를 먼저 복사·설치하고 소스를 나중에 복사하는 순서가 핵심 — 소스만 바뀌면 설치 레이어가 캐시돼 빌드가 빨라집니다. `--host 0.0.0.0`은 컨테이너 외부 접속용.

## 자주 겪는 함정

- **bcrypt 버전 충돌** → `passlib[bcrypt] 1.7.4`는 `bcrypt 5.x`와 안 맞는다. `requirements.txt`에 `bcrypt==4.0.1`로 고정.
- **응답에 비밀번호가 샌다** → `response_model`을 안 걸었거나 Response 스키마에 password를 넣었다. 스키마를 Create/Response로 분리.
- **CORS 오류(브라우저 콘솔 빨강)** → `allow_origins`에 프론트 주소가 없다. F12 Network에서 OPTIONS(Preflight)가 200인지 확인.
- **422가 자꾸 난다** → 요청 JSON이 스키마와 다르다. `/docs`의 스키마 예시와 필드명·타입을 대조.
- **세션이 안 닫혀 커넥션 고갈** → 라우터에서 세션을 직접 만들지 말고 `Depends(get_db)`로만 받는다.
- **DB 컬럼과 스키마 불일치** → models에 없는 필드를 schemas가 요구하면 깨진다. 두 파일을 함께 수정.

## 백엔드 선택 가이드 — Supabase vs FastAPI

| 상황 | 추천 |
| --- | --- |
| 로그인 + 간단 CRUD + RLS면 충분 | Supabase (백엔드 없이) |
| 복잡한 도메인 로직·서버 검증·트랜잭션 | FastAPI 백엔드 |
| AI 모델 추론을 API에 결합 | FastAPI (1~8장 + 이 패턴) |
| 빠른 프로토타입 → 나중에 확장 | Supabase로 시작, 필요한 부분만 FastAPI로 |

## 점검 체크리스트

```text
□ models(DB) / schemas(API)를 분리했는가
□ Create/Response 스키마를 나눠 비밀번호 노출을 막았는가
□ 모든 라우터가 Depends(get_db)로 세션을 받는가
□ DB 로직을 crud/로 분리했는가 (라우터는 얇게)
□ 비밀번호를 bcrypt로 해싱해 저장하는가
□ 201/204/400/404 상태 코드를 의미대로 쓰는가
□ CORS allow_origins에 프론트 주소를 넣었는가 (운영 시 실도메인)
□ TestClient 테스트 5개 이상 (비밀번호 미노출 포함)
□ Dockerfile 레이어 순서(requirements 먼저)를 지켰는가
```

## 실습 과제

- [기초] User·Item CRUD를 만들고 `/docs`에서 POST→GET→PUT→DELETE를 순서대로 실행해 상태 코드(201/200/200/204)를 확인하라.
- [응용] `UserResponse`에서 password를 제거한 뒤, `test_create_user`로 응답에 비밀번호가 없음을 테스트로 증명하라.
- [심화] [도서 관리 API](/lesson/ai-09)(9.9절)를 JWT 인증과 함께 구현하라. 조건: ① 회원가입·로그인 ② Book CRUD ③ 본인만 수정·삭제 ④ pytest 5개 이상.

> 💡 **Tip!** 핵심 한 줄 — "models와 schemas를 나누고, 세션은 Depends로, DB는 crud로. 이 세 줄만 지켜도 백엔드는 안 무너진다."
