---
layout: single
category: DB
tags: ['db', 'trigger', 'postgresql']
# published : false
toc: true
toc_sticky: true
---


오늘은 업무를 진행하면서 배웠던 Trigger에 대해 정리해보고자 합니다. 
DB 는 Postgresql 13 버젼을 기준으로 기술하였습니다. 

## Trigger (트리거) 란 ?

트리거는 대부분의 데이터베이스에서 이벤트에 의해 자동으로 응답하는 방법입니다.
데이터베이스 또는 특정 테이블에 연결되어 이벤트를 수신하면 특정 코드세트를 실행시킬 수 있습니다.

쉽게말해서 테이블에 어떤 행이 INSERT , UPDATE , DELETE 되는 순간 등을 읽어서 
내가 원하는 동작을 수행하는 방법입니다.

> 일반적으로 트리거는 DML 트리거를 의미하는데 (가장 많이 쓰입니다)
DML은 Data Definition Language의 약자로 데이터베이스에 입력된 데이터를 조작(등록, 수정, 삭제)하는 언어를 말합니다.

## 트리거는 언제 쓰이나요 ?

트리거를 사용하는 이유는 대체로 이렇다고 많이들 얘기하시는 것 같아요
- **민감한 테이블에 대한 변경 감사 및 로깅**
사용자가 내용을 변경하는 그 순간에,
누가, 언제, 어떤값을 변경 했는지에 대한 기록을 history 테이블에 저장하고 싶다. 
- **보안적인 이유**
 보안상 사용자가 접근할 수 없는 테이블에 값을 추가해야 할 때 (접속한 사용자의 ip address를 수집하고 싶다.)
- **간단한 검증 & 수정** 
 ex) 센서로부터 들어오는 데이터의 입력 시각을 초 단위까지 저장할 것이지만 초의 1의 자릿수 하위는 절삭하고 싶다. 
 (12:01:32.123123 -> 12:01:30.000000)
 - ... 

그런데 위의 예시 말고도 필요로 하는 경우가 종종 있습니다.
트리거를 반드시 사용해야하는 것은 아니지만 
개발하다보니 필요로 하는 순간이 종종 있습니다. 

## 사용 시 주의점
개발 초기 단계에서부터 잘 설계한 트리거 함수와 테이블은 api 서버를 개발하는 입장에선 만능처럼 느껴집니다.

극단적으로는 어플리케이션 서버가 클라이언트로부터 받은 핵심 데이터만 데이터베이스에 전달하도록 하고 입력으로부터 파생된 연산은 db server에 맡겨버릴 수도 있습니다. 

처음엔 어플리케이션 서버에 코드를 작성하는 것보다 트리거 함수를 작성하는 것이 더 빠르고 쉽게 느껴지겠지만 
잘못하면 심각한 성능위험을 야기할 수 있습니다. 게다가 트리거의 양이 많아질 수록 디버깅도 어렵고 유지보수 비용도 증가하죠.

> ### 가능하면 피해야 하는 경우
> 1. **트리거가 너무 많이 있다.** (*유지보수가 어렵다.*)
> 2. **트리거 함수의 코드가 너무 복잡하다.** (*이해하기가 어렵다.*)
> 3. **트리거 함수의 코드 내부에 또 다른 저장 프로시저가 존재함.** (*실제론 복잡한데 단순해보이게 함.*)
> 4. **트리거 함수가 재귀 순환한다.** (*성능을 크게 저하시킵니다 !* )
> 5. **트리거 함수 코드에 의해 또 다른 트리거가 호출된다.** ( *문제발생 시 찾는게 어렵다.* )
> 6. **트리거에서 반복문이 돈다.**  (*단일행 트리거인 경우 복수행 입력 시 성능 저하* )

상황에 따라 위의 경우를 중 몇개가 해당되어야 할 수 있습니다.

그러나 트리거는 반드시 성능을 고려하고 도입해야합니다.

이벤트를 받아 트리거 함수가 동작할 때, **트리거의 영향을 받는 모든 개체들은 트랜잭션이 열린 상태로 유지됩니다.**
즉, 트리거 연산 시간만큼 트랜잭션 lock 타임도 길어진다는 것이죠.
잘못짠 트리거는 성능을 크게 저하시킬 수 있습니다. 

>### 가능하면 이렇게
>1. **문서화**
트리거가 아니더라도 특정 함수를 작성할 때는 
누가 와서 읽더라도 이 것이 왜 있는지, 뭘 하는지, 어떻게 동작 하는지 알 수 있도록
>2. **하나의 작업당 하나의 트리거만 사용**
트리거는 필요에 의해서만 사용하고, 무분별한 사용은 지양
>3. **가능하면 간단히 작성**
너무 복잡한 비즈니스 로직은 트리거에서 처리 X


## 트리거 작성 문법

postgresql 에서 트리거 작성 문법은 다음과 같습니다. 
>{ }  : 필수선택
[ ] : 생략가능
```sql
CREATE OR REPLACE TRIGGER 트리거_이름  
{ BEFORE | AFTER | INSTEAD OF }     -- 트리거 실행 시점
{ DML이벤트 [ OR DML이벤트 ... ] }     -- 트리거 이벤트 (INSERT or UPDATE or DELETE ..)
ON 트리거를_적용시킬_테이블_또는_뷰_이름
FOR EACH { ROW | STATEMENT } 		-- 트리거 실행범위 ( 각행 또는 한번만 )
[WHEN (조건)] 						-- 트리거 실행 조건( EACH ROW 일 때 조건에 만족하는 행만 수행가능 )
EXCUTE { FUNCTION | PROCEDURE } 함수명("문자열_상수_파라미터"); 
```
---
### 트리거 실행시점 
- **BEFORE** : 트리거 이벤트(INSERT or UPDATE ..)가 **실행되기 전**에 트리거로 야기되는 동작이 수행됩니다. 
그렇기 때문에 각 행에 대해서 모든 조치가 수행되고 나서 트리거를 적용시킬 테이블 이벤트가 수행됩니다.
- **AFTER** : 트리거 이벤트가 **실행된 후**에 트리거로 야기되는 동작이 수행됩니다.
때문에 각 행 또는 모든 명령 세트가 수행된 후에 트리거를 적용시킬 테이블 이벤트가 수행됩니다.
- **INSTEAD OF** : **이벤트를 실행하는 대신** 영향을 받을 각 행에 대해 트리거 조치가 활성화 됩니다. 
> BEFORE , AFTER 트리거와는 달리 **INSTEAD OF 트리거는 테이블이 아니라 뷰(View)에 대해서만 정의할 수 있습니다.**
> 게다가 실행 범위가 각 행인 경우에만 정의할 수 있습니다.
> INSTEAD OF 트리거는 원래 삽입, 갱신, 삭제가 불가능한 뷰의 데이터를 조작할 수 있습니다.
> **반대로 BEFORE, AFTER 트리거는 실행범위가 각 행인 경우 테이블(Table)에 대해서만 정의할 수 있습니다.

#### 실행시점에 따른 사용 용도
트리거 실행 시점이 다른 것은 트리거의 용도가 다른 것을 의미합니다.

> INSTEAD OF 트리거의 경우 뷰의 조작이 가능하다는 점이 있지만 두 BEFORE, AFTER와 성격이 다름으로 이
> 토픽에선 소개하지 않고 , BEFORE 와 AFTER 트리거의 차이에 대해서만 기술하겠습니다.

일반적으로,
- BEFORE 트리거는 입력될 데이터에 유효성을 확인하거나 
다른 테이블에서 값을 읽어서 새로 삽입될 행에 추가 데이터를 넣어주는 방식으로 사용됩니다.

- AFTER 트리거는 데이터 입력 이후,  후속 수정 조작을 수행하거나 (히스토리 테이블을 찍는 등)
입력된 값에 의해 데이터베이스 외부에서 경보를 울리는 등의 후속 조치를 수행할 때 사용합니다.

양 트리거의 결정적 차이는 트리거 이벤트가 트리거 조치 이후에 수행 되는지 조치 이전에 수행 되는지 입니다.
그 차이에 따라 사용법도 서로 다르기 때문에 적절한 트리거를 선택 해야겠습니다.

>트리거 이벤트가 수행된다는 것은 ( 그리고 그것이 성공했다는 것은 ) 변경된 데이터가 무결성 제약조건에 위배되지 않았다는 것 입니다.
즉, BEFORE 의 경우 이벤트가 수행되기 전에 조치가 먼저 수행되기 때문에 무결성 제약조건을 검사하지 않죠.
따라서 ***BEFORE 트리거의 경우는 INSERT, UPDATE, DELETE, MERGE 등의 SQL 문을 함수에 포함할 수 없습니다!***
왜냐하면 이벤트에 의해 수행될 조치를 정의하는 것인데. 무결성 제약조건 검사를 수행하기 이전이라 이벤트가 정상적으로 수행될 지 모르기 때문입니다. 

---

### 트리거 이벤트
- **INSERT** : 삽입 이벤트에 대해 조치합니다. (트리거 실행범위가 행 수준일 때, **NEW** 변수로 새롭게 등록되는 행에 접근가능)
- **UPDATE** : 갱신 이벤트에 대해 조치합니다. (트리거 실행범위가 행 수준일 때, **OLD, NEW** 변수로 변경 전과 변경 후의 행에 접근가능)
>UPDATE [ OF 컬럼명1, 컬럼명2, ...]  이렇게 특정 컬럼의 변경만 조치할 수도 있습니다.
- **DELETE** : 삭제 이벤트에 대해 조치합니다. (트리거 실행범위가 행 수준일 때, **OLD** 변수로 삭제 전의 행에 접근가능)
- **TRUNCATE** : truncate 대해 조치합니다. ( Postgresql ) 

트리거 이벤트는 INSERT OR UPDATE .. 와 같이 여러 이벤트 세트를 동시에 검사할 수 있습니다.

> TRUNCATE 이벤트는 모든 데이터를 지우고 공간을 반납하는 명령입니다.  
> 당연하게도 실행범위가 각 행인 경우는 있을 수 없기 때문에 범위가 STATEMENT(한번만)에서만 사용할 수 있습니다.

---

### 트리거 실행범위
- **ROW** : 전체 명령의 각 행당 한번씩 수행됩니다.
- **STATEMENT** : 한번만 수행됩니다. (**기본값**)


---

### 트리거 실행조건 
트리거 함수가 실제로 실행되는지 여부를 결정하는 조건식입니다. 
IF WHEN 표현식으로 작성해야하며 조건의 결과가 true일 경우 함수가 실행됩니다.
실행범위가 ROW 일 경우 트리거 이벤트에 따라 new 또는 old 변수에 접근할 수 있습니다.

---

### 그 외에 알아야 할 점 
1. **동일한 이벤트에 여러 트리거가 정의되었을 경우** : 
	동일한 이벤트에 대해 동일한 종류의 여러 트리거가 정의된 경우 **이름의 알파벳 순서**로 트리거됩니다.
2. **트리거 함수에 PROCEDURE 와 FUNCTION의 차이** :
	동작상 차이는 없습니다. 그러나 반드시 프로시저가 아니라 함수가 참조되어야 합니다. 프로시저는 더이상 사용되지 않습니다.

## 트리거 함수
Postgresql 은 트리거를 작성하면서 동시에 동작 명령을 정의할 수 없습니다. 
반드시 동작시킬 트리거 함수를 먼저 정의하여 트리거 생성문에 삽입하여야 합니다. 

### 트리거 함수의 형태 
```sql
CREATE FUNCTION 함수명() RETURNS trigger AS $$
  DECLARE
   ...
  BEGIN
      ...
      RETURN { NULL, OLD, NEW, ...};
  END;
$$ LANGUAGE plpgsql;
```
트리거 함수는 return type이 trigger 이고 파라미터가 없는 일반적인 function 으로 선언해야합니다.
트리거 선언부에서 파라미터를 실제로 함수로 전달한다 하더라도,  반드시 파라미터가 없는 형태로 작성해야 합니다.
> Q. 전달될 인수는 어디갔나요 ? 
> A. 아래에서 설명할 TG_ARGV 라는 특수 변수 배열에서 조회할 수 있습니다.

### 트리거 함수의 반환값
트리거 함수의 반환 값(RETURN VALUE)은  
NULL 또는 트리거 함수를 호출한 테이블의 레코드와 정확히 똑같은 구조의 레코드를 반환해야합니다. 

**규칙**
1. **BEFORE 트리거가 호출한 함수의 반환값이 NULL 인 경우** 
일련의 작업이 모두 취소되고 EVENT도 수행되지 않습니다. 트리거를 호출한 테이블의 행이 등록, 수정, 삭제되지 않습니다. 
2. **INSERT, UPDATE EVENT가 호출한 BEFORE 트리거일 경우** 
RETURN 하는 레코드 데이터가 트리거를 호출한 테이블에 반영됩니다. (해당 이벤트에 트리거 함수가 하나만 존재할 경우) 
> 트리거 함수가 2개 이상 존재할 경우, 알파뱃 순서대로 트리거 함수가 호출되며 이전의 트리거 함수의 RETURN 레코드가 후속 트리거 함수의 NEW에 삽입됩니다.
3. **DELETE EVENT가 호출한 BEFORE 트리거의 경우** 
RETURN 값의 데이터가 특별히 어떠한 영향을 끼치지 않지만 
트리거 함수가 2개 이상 존재할 경우, 후속 작업을 수행하기 위해선 반드시 NULL이 아닌 값을 RETURN 해야합니다. 
**DELETE EVENT 의 트리거일 경우 NEW 값이 NULL 인 것을 잊지마세요 !
4. **실행시점이 AFTER인 트리거나 실행범위가 STATEMENT(한번만)인 트리거는** 
RETURN 값이 무엇이든지 무시합니다.


### 트리거 함수의 특수 변수들
선언한 함수가 트리거에게 호출될 때 특수한 변수들이 자동으로 만들어집니다.
다음은 자주 사용하는 변수들 입니다. 
- **NEW** ( record ) 
  EACH ROW(각 행) INSERT, UPDATE 상황에서 새롭게 입력되거나 변경되는 레코드 정보
- **OLD** ( record ) 
  EACH ROW(각 행) UPDATE, DELETE 상황에서 변경되거나, 삭제되는 레코드 정보
  
|구분|NEW|OLD|
|--|--|--|
|INSERT  | 신규 RECORD|NULL|
|UPDATE  |변경이후 RECORD|변경이전 RECORD|
|DELETE  | NULL|삭제되는 RECORD|

- **TG_OP** ( text ) 
  함수를 호출하게된 트리거 이벤트의 문자열 ( "INSERT", "UPDATE" 등 )
- **TG_TABLE_NAME** ( text ) 
  함수의 호출을 야기한 테이블 이름의 문자열 
- **TG_NARGS** ( integer )
  전달된 파라미터의 수
- **TG_ARGV** ( text[] )
  전달된 파라미터 문자열의 배열


### 트리거 함수의 작성 예제
다음은 트리거 함수의 작성 예제입니다.

**실행시점이 BEFORE인 경우**
```sql
-- 사원의 급여 테이블이 업데이트 될 때마다 현재 사용자의 이름과 시간이 행에 같이 업데이트 되도록 함
-- 그리고 업데이트 된 급여가 양수인지 체크함

CREATE TABLE 사원 (
     이름 text,
     급여 integer,
     수정시간 timestamp,
     수정한사람 text
 );
    
CREATE FUNCTION change_사원급여() RETURNS trigger AS $$
    BEGIN
        -- 새로 입력받거나 수정된 행의 사원 이름과 급여가 NULL이 아닌지 확인
        IF NEW.이름 IS NULL THEN
            RAISE EXCEPTION '사원 이름은 null이 될 수 없습니다.';
        END IF;
        IF NEW.급여 IS NULL THEN
            RAISE EXCEPTION '% 급여는 null이 될 수 없습니다.', NEW.이름;
        END IF;

        -- 세상에 돈을 지불하면서 일하는 사람이 누가있나요 ?
        IF NEW.급여 < 0 THEN
            RAISE EXCEPTION '% 급여가 0보다 적습니다..', NEW.이름;
        END IF;

        -- 급여 정보를 누가, 언제 수정했는지 같이 업데이트 해주자
        NEW.수정시간 := current_timestamp;
        NEW.수정한사람 := current_user;
        -- 돌려줌 (BEFORE 시점이기 때문에 새로운 정보가 포함된 상태로 event 가 동작할 것임)
        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER change_사원급여 BEFORE INSERT OR UPDATE ON emp
    FOR EACH ROW EXECUTE FUNCTION change_사원급여();
```
**실행시점이 AFTER인 경우**
```sql	
-- 사원 테이블의 데이터 변경작업이 수행되면 수행된 작업 정보를 history 테이블에 저장합니다. 

CREATE TABLE 사원 (
    이름  text NOT NULL,
    급여  integer
);

CREATE TABLE 사원_변경기록(
    수행한작업   char(1)   NOT NULL,
    시각      timestamp NOT NULL,
    변경한사람  text      NOT NULL,
    사원이름   text      NOT NULL,
    급여      integer
);

CREATE OR REPLACE FUNCTION 사원_변경기록_입력() RETURNS TRIGGER AS $$
    BEGIN
        -- 사원테이블의 데이터를 변경하면 사원_변경기록 테이블에 새로운 행을 입력합니다,
        -- 특수변수인 TG_OP의 값에 따라 새로운 행의 데이터를 다르게 분기합니다.
        IF (TG_OP = 'DELETE') THEN
            INSERT INTO 사원_변경기록 SELECT 'D', now(), user, OLD.*;
        ELSIF (TG_OP = 'UPDATE') THEN
            INSERT INTO 사원_변경기록 SELECT 'U', now(), user, NEW.*;
        ELSIF (TG_OP = 'INSERT') THEN
            INSERT INTO 사원_변경기록 SELECT 'I', now(), user, NEW.*;
        END IF;
        RETURN NULL; -- result is ignored since this is an AFTER trigger
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER 사원_변경기록
AFTER INSERT OR UPDATE OR DELETE ON 사원
    FOR EACH ROW EXECUTE FUNCTION 사원_변경기록_입력();
```
예제 코드를 보시면 아시겠지만 실행 시점에 따라 수행하는 작업이 다르단 것을 알 수 있습니다 !
두 함수의 차이를 잘 모르시겠다면 **트리거 실행시점** 부분을 다시 확인해주세요 :)

## 작성한 트리거 확인 쿼리
```sql
SELECT 
TGNAME as '호출한 테이블', 
PRONAME as '트리거 함수명', 
PG_GET_TRIGGERDEF(t.OID) as '트리거 선언부'
from PG_TRIGGER t
join PG_PROC p on p.OID = TGFOID
where not TGISINTERNAL
and TGRELID = '트리거를 호출하는 테이블 이름'::regclass;
```
## 트리거를 작성했는데 값이 안들어와요 ! 
저희는 사람이기 때문에 문법 실수를 할 수도 있고 여러가지 이유로 트리거 함수가 실행되지 않을 수 있습니다.
트리거 함수의 경우 일반 함수와 다르게 작성 후 바로 실행테스트를 하기가 번거롭고, 직접 실행하고 결과로그를 확인하기 어렵기 때문에 다른 함수들과 마찬가지로 error 로그를 저장할 테이블을 만들고 함수 실행 중 발생하는 에러를 핸들링 하세요.

```sql
CREATE TABLE errors 
	(id SERIAL, 
	sql_state TEXT, 
	message TEXT, 
	detail TEXT, 
	hint TEXT, 
	context TEXT);


CREATE OR REPLACE FUNCTION 사원_변경기록_입력()  RETURNS  TRIGGER  AS $$
DECLARE
    _sql_state TEXT;
    _message TEXT;
    _detail TEXT;
    _hint TEXT;
    _context TEXT;
BEGIN ... 
EXCEPTION
    WHEN OTHERS THEN
        GET STACKED DIAGNOSTICS
            _sql_state := RETURNED_SQLSTATE,
            _message := MESSAGE_TEXT,
            _detail := PG_EXCEPTION_DETAIL,
            _hint := PG_EXCEPTION_HINT,
            _context := PG_EXCEPTION_CONTEXT;

		INSERT INTO errors (sql_state, message, detail, hint, context)
        VALUES (_sql_state, _message, _detail, _hint, _context);
        ...
END;
```



## 트리거 삭제
트리거 삭제하려면 트리거를 먼저 삭제하고 트리거 함수를 삭제하세요.

**트리거 삭제**
```sql
DROP TRIGGER [IF EXISTS] 트리거_이름
ON 테이블_이름 [ CASCADE | RESTRICT ];
```
**트리거 함수 삭제**
```sql
DROP FUNCTION [ IF EXISTS ] 함수_이름() [ CASCADE | RESTRICT ]
 ```

---
### *reference*
- https://www.postgresql.org/docs/current/plpgsql-trigger.html
- https://www.postgresql.org/docs/current/sql-createtrigger.html
- https://www.postgresql.org/docs/13/plpgsql-trigger.html
- https://www.techonthenet.com/oracle/triggers/before_insert.php
- https://www.ibm.com/docs/ko/db2/11.1?topic=statements-create-trigger
- https://www.ibm.com/docs/ko/i/7.3?topic=triggers-instead-sql
- https://www.ibm.com/docs/ko/db2/11.1?topic=dt-specifying-when-trigger-fires-before-after-instead-clauses
- https://www.red-gate.com/simple-talk/homepage/sql-server-triggers-good-scary/
- https://stackoverflow.com/questions/53504234/pgsql-trigger-function-write-exception-to-log-table
- https://www.cybertec-postgresql.com/en/postgresql-how-to-write-a-trigger/

