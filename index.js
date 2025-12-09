/* --- 1. 변수 선언 --- */
        const container = document.querySelector('.horizontal-container');
        const originalSections = document.querySelectorAll('.section');

        // 버튼 두 개 선택
        const gridContainer = document.querySelector('.grid-view-container');
        const btnOpen = document.querySelector('.view-toggle-btn');   // 버튼 1 (네모)
        const btnClose = document.querySelector('.view-toggle-btn-2'); // 버튼 2 (동그라미)

        const header = document.querySelector('header');
        const menuTrigger = document.querySelector('.menu-trigger');

        // [Clone 생성 로직]
        const firstClone = originalSections[0].cloneNode(true);
        const lastClone = originalSections[originalSections.length - 1].cloneNode(true);

        container.appendChild(firstClone);
        container.insertBefore(lastClone, container.firstChild);

        const allSections = document.querySelectorAll('.section');
        const totalSlides = allSections.length;

        // 초기 설정
        let currentIndex = 1;
        let isAnimating = false;
        let isGridView = false;

        gsap.set(container, { xPercent: -100 * currentIndex });


        // --- 2. 휠 이벤트 ---
        window.addEventListener('wheel', (e) => {
            if (isGridView || isAnimating) return;
            if (Math.abs(e.deltaY) < 30) return;

            if (header.classList.contains('active')) {
                closeMenu();
                return;
            }

            if (e.deltaY > 0) {
                gotoSection(currentIndex + 1);
            } else {
                gotoSection(currentIndex - 1);
            }
        });


        // --- 3. 슬라이드 이동 함수 ---
        // --- 3. 슬라이드 이동 함수 ---
function gotoSection(index) {
    isAnimating = true;

    // 1. 이동할 다음 섹션과 이미지를 찾는다
    const nextSection = allSections[index];
    const nextImg = nextSection.querySelector('img');

    // 2. 이미지가 있다면, 캐릭터별로 등장 방향을 다르게 설정한다.
    if (nextImg) {
        
        // [변수 준비] 시작할 위치(x, y)를 저장할 변수 (기본값: 오른쪽에서 등장)
        let startProps = { x: "30vw", y: 0, opacity: 0 }; 

        // [설정] 캐릭터별로 조건문(if)을 걸어서 위치를 바꿈
        
        if (nextSection.classList.contains('monica')) {
            startProps = { x: "30vw", y: 0, opacity: 0 }; 
            // animDelay = 1.0; // ✨
        }
        else if (nextSection.classList.contains('rachel')) {
            // 레이첼: 왼쪽에서 등장
            startProps = { x: "-30vw", y: 0, opacity: 0 };
        }
        else if (nextSection.classList.contains('phoebe')) {
            // 피비: 위에서 뚝 떨어지게? (통통 튀는 느낌)
            startProps = { x: 0, y: "-50vw", opacity: 0 };
        }
        else if (nextSection.classList.contains('ross')) {
            // 로스: 오른쪽에서 스윽
            startProps = { x: "-30vw", y: 0, opacity: 0 };
        }
        else if (nextSection.classList.contains('joey')) {
            // 조이: 아래에서 위로 쑥! (음식 들고 나타나듯이)
            startProps = { x: 0, y: "30vw", opacity: 0 };
        }
        else if (nextSection.classList.contains('chandler')) {
            // 챈들러: 왼쪽에서 스윽
            startProps = { x: "-30vw", y: 0, opacity: 0 };
        }

        // [애니메이션 실행] 설정한 startProps 값을 넣어서 실행!
        gsap.fromTo(nextImg, 
            startProps, // 위에서 정한 시작 위치
            { 
                x: 0, 
                y: 0, 
                opacity: 1, 
                duration: 1, 
                ease: "power2.out", // 📌 피비만 "bounce.out" 쓰고 싶으면 이것도 분기 처리가능
                delay: 0.3 
            }
        );
    }

    // 3. 컨테이너 이동 (기존과 동일)
    currentIndex = index;
    gsap.to(container, {
        xPercent: -100 * currentIndex,
        duration: 0.75,
        ease: "power2.inOut",
        onComplete: () => {
            isAnimating = false;
            checkLoop();
        }
    });
}
        // --- 4. 무한 루프 처리 ---
        function checkLoop() {
            if (currentIndex >= totalSlides - 1) {
                currentIndex = 1;
                gsap.set(container, { xPercent: -100 * currentIndex });
            }
            else if (currentIndex <= 0) {
                currentIndex = totalSlides - 2;
                gsap.set(container, { xPercent: -100 * currentIndex });
            }
        }


        // --- 5. [수정됨] 버튼 기능 설정 ---

        // [버튼 1] 토글 기능 (열려있으면 닫고, 닫혀있으면 열기)
        // [버튼 1] 토글 기능 (열려있으면 닫고, 닫혀있으면 열기)
        btnOpen.addEventListener('click', () => {

            if (!isGridView) {
                // [CASE 1] 그리드가 닫혀있을 때 -> 엽니다.
                isGridView = true;
                gsap.to(container, { autoAlpha: 0, duration: 0.5 });
                gsap.to(gridContainer, { autoAlpha: 1, duration: 0.5 });

                // ✨ [추가된 부분] 이름 이미지들이 위에서 툭툭 떨어지는 애니메이션
                gsap.fromTo(".name-section img",
                    { y: -400, opacity: 0 }, // 시작 상태: 위로 200px 올라가 있고 투명함
                    {
                        y: 0,                // 끝 상태: 원래 CSS 위치(0)로 돌아옴
                        opacity: 1,          // 불투명해짐
                        duration: 2,       // 떨어지는 데 걸리는 시간 (취향껏 조절)
                        ease: "bounce.out",  // 핵심! 공이 바닥에 튀기는 듯한 움직임
                        stagger: 0.1,        // 0.1초 간격으로 하나씩 순서대로 떨어짐 (없으면 동시에 떨어짐)
                        delay: 0.2           // 화면이 바뀐 뒤 아주 잠깐 있다가 시작
                    }
                );

            } else {
                // [CASE 2] 그리드가 이미 열려있을 때 -> 닫습니다.
                isGridView = false;
                gsap.to(gridContainer, { autoAlpha: 0, duration: 0.5 });
                gsap.to(container, { autoAlpha: 1, duration: 0.5 });
            }
        });

        // [버튼 2] 무조건 닫기 (원래대로 돌아가기)
        btnClose.addEventListener('click', () => {
            // 이미 닫혀있으면 아무것도 안 함
            if (!isGridView) return;

            isGridView = false;

            // 그리드 숨기기, 가로화면 보이기
            gsap.to(gridContainer, { autoAlpha: 0, duration: 0.5 });
            gsap.to(container, { autoAlpha: 1, duration: 0.5 });
        });


        /* --- 6. 메뉴 관련 코드 --- */
        header.classList.add('hide');
        menuTrigger.classList.add('visible');

        menuTrigger.addEventListener('click', () => {
            if (header.classList.contains('hide')) {
                openMenu();
            } else {
                closeMenu();
            }
        });

        function openMenu() {
            header.classList.remove('hide');
            header.classList.add('active');
            menuTrigger.innerText = "menu";
            menuTrigger.style.color = "#fff";
        }

        function closeMenu() {
            header.classList.add('hide');
            header.classList.remove('active');
            menuTrigger.innerText = "menu";
            menuTrigger.style.color = "#fff";
        }


        /* --- 7. Back 버튼 기능 --- */
        // const backBtn = document.querySelector('.back-btn');

        // backBtn.addEventListener('click', () => {
        //     // 브라우저의 히스토리 기록을 이용해 뒤로 가기
        //     window.history.back();
        // });






        
        /* --- [초기 실행] 페이지 로드 시 모니카(현재 섹션) 애니메이션 강제 실행 --- */
window.onload = () => {
    // 1. 현재 보고 있는 섹션(보통 모니카, index 1)을 찾음
    const currentSection = allSections[currentIndex];
    const currentImg = currentSection.querySelector('img');

    if (currentImg) {
        // 모니카일 경우 딜레이 1초, 아니면 0.3초 (혹시 순서 바꿀 수도 있으니까)
        let initialDelay = currentSection.classList.contains('monica') ? 1.0 : 0.3;
        
        // 애니메이션 즉시 실행
        gsap.fromTo(currentImg, 
            { x: "30vw", opacity: 0 }, // 시작: 오른쪽에서 투명하게
            { 
                x: 0, 
                opacity: 1, 
                duration: 1, 
                ease: "power2.out", 
                delay: initialDelay // 설정한 딜레이 적용
            }
        );
    }
}