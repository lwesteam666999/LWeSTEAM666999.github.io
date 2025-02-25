function showLoginForm() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
}

function showRegisterForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

function handleLogin(e) {
    e.preventDefault();
    
    const form = e.target.closest('form'); // 获取所属表单
    const formData = {
        username: form.querySelector('[name="username"]').value,
        password: form.querySelector('[name="password"]').value
    };
    
    console.log('提交数据：', formData); // 新增这行

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        // 在fetch请求中添加credentials（如需跨域带cookie）
        credentials: 'include',
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = 'http://localhost:4000';
        } else {
            alert('登录失败: ' + (data.message || '未知错误'));
        }
    })
    .catch(error => console.error('Error:', error));
}
function handleRegister(e) {
    e.preventDefault();
    
    const form = e.target.closest('form');
    const formData = {
        username: form.querySelector('[name="username"]').value,
        password: form.querySelector('[name="password"]').value
    };

    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('注册成功！');
            showLoginForm(); // 自动跳转回登录界面
        } else {
            alert('注册失败: ' + (data.message || '未知错误'));
        }
    })
    .catch(error => console.error('Error:', error));
}