const header = document.querySelector('header');
const menuTrigger = document.querySelector('.menu-trigger');
let isMenuOpen = false;

window.addEventListener('scroll', () => {
    // 🚩 스크롤 감지 로직 변경: "메뉴가 열려있어도 스크롤 내리면 닫아버림"
    
    if (window.scrollY > 50) {
        // [스크롤 내렸을 때]
        
        // 1. 헤더는 무조건 숨김
        header.classList.add('hide');
        
        // 2. 버튼은 무조건 보임
        menuTrigger.classList.add('visible');

        // 3. [핵심 추가] 만약 메뉴가 "CLOSE" 상태로 열려있었다면? -> 강제로 닫힘 처리
        if (isMenuOpen) {
            isMenuOpen = false; // 상태를 '닫힘'으로 변경
            
            // 버튼 디자인을 다시 "MENU" 스타일로 초기화
            menuTrigger.innerText = "menu";
            menuTrigger.style.backgroundColor = ""; // CSS 기본값으로 복구
            menuTrigger.style.color = ""; 
            menuTrigger.style.borderColor = ""; 
            
            // 헤더의 배경색/블러 효과도 끔
            header.classList.remove('active');
        }

    } else {
        // [맨 위로 올라갔을 때]
        
        // 헤더 보이고, 버튼 숨김 (기본 상태)
        header.classList.remove('hide');
        menuTrigger.classList.remove('visible');
        
        // 혹시 열려있는 상태로 맨 위로 왔다면, 상태 리셋
        if (isMenuOpen) {
            isMenuOpen = false;
            header.classList.remove('active');
            menuTrigger.innerText = "menu";
            menuTrigger.style.backgroundColor = "";
            menuTrigger.style.color = "";
        }
    }
});

// 클릭 이벤트 (토글 기능)
menuTrigger.addEventListener('click', () => {
    if (header.classList.contains('hide')) {
        // [메뉴 열기]
        // 헤더를 보이게 내리고, active 클래스 추가(블러 효과 등)
        header.classList.remove('hide');
        header.classList.add('active'); 
        
        // 버튼을 "CLOSE" 스타일로 변경
        menuTrigger.innerText = "menu";
        // menuTrigger.style.backgroundColor = "#FE5F58"; // 빨간색
        menuTrigger.style.color = "#B650F0";
        // menuTrigger.style.borderColor = "#FE5F58";
        
        isMenuOpen = true;
    } else {
        // [메뉴 닫기] (직접 눌러서 닫을 때)
        header.classList.add('hide');
        header.classList.remove('active');
        
        // 버튼을 "MENU" 스타일로 복구
        menuTrigger.innerText = "menu";
        // menuTrigger.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
        menuTrigger.style.color = "#B650F0";
        menuTrigger.style.borderColor = "#B650F0"; // 원래 테두리 색상
        
        isMenuOpen = false;
    }
});