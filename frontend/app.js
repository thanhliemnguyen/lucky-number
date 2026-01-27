const API_URL = 'https://lucky-number-backend-5s67.onrender.com'; // Backend URL

// Tab switching
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(`${tab.dataset.tab}-tab`).classList.add('active');
    });
});

// Load config
async function loadConfig() {
    try {
        const res = await fetch(`${API_URL}/api/config`);
        const config = await res.json();
        
        // Banner - chỉ hiện nếu có ảnh
        if (config.banner.enabled && config.banner.image) {
            const bannerHTML = config.banner.link 
                ? `<a href="${config.banner.link}" target="_blank"><img src="${config.banner.image}" alt=""></a>`
                : `<img src="${config.banner.image}" alt="">`;
            document.getElementById('banner-container').innerHTML = bannerHTML;
        }
        
        // Donate
        if (config.donate.enabled) {
            let donateHTML = '<h3>☕ Ủng Hộ Tác Giả</h3><div class="donate-methods">';
            config.donate.methods.forEach(method => {
                donateHTML += `
                    <div class="donate-item">
                        <strong>${method.name}:</strong> ${method.info}
                        ${method.qr ? `<br><img src="${method.qr}" style="max-width:200px;margin-top:10px;" alt="">` : ''}
                    </div>
                `;
            });
            donateHTML += '</div>';
            document.getElementById('donate-container').innerHTML = donateHTML;
        }
    } catch (error) {
        console.error('Không thể tải config:', error);
    }
}

// Lucky number form
document.getElementById('lucky-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        name: document.getElementById('name').value,
        day: document.getElementById('day').value,
        month: document.getElementById('month').value,
        year: document.getElementById('year').value,
        count: parseInt(document.getElementById('count').value)
    };
    
    try {
        const res = await fetch(`${API_URL}/api/lucky-number`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await res.json();
        
        let html = '';
        
        if (data.count === 1) {
            const analysis = result.numbers[0].analysis;
            html = `
                <div class="lucky-display">
                    <h3>Số May Mắn Của Bạn</h3>
                    <div class="lucky-number">${analysis.number}</div>
                    <p><strong>${data.name}</strong> - ${result.date}</p>
                    
                    <div class="analysis">
                        <h3>${analysis.name}</h3>
                        <p><strong>Ngũ hành:</strong> ${analysis.element}</p>
                        <p><strong>Màu sắc:</strong> ${analysis.color}</p>
                        <p><strong>Vận số:</strong> ${analysis.lucky}</p>
                        <p><strong>Ý nghĩa:</strong> ${analysis.meaning}</p>
                        <hr style="margin:15px 0;border:none;border-top:1px solid rgba(255,255,255,0.3);">
                        <h4 style="margin-bottom:10px;">🔮 Phân Tích Chi Tiết</h4>
                        <p><strong>👤 Tính cách:</strong> ${analysis.aspect.personality}</p>
                        <p><strong>💼 Sự nghiệp:</strong> ${analysis.aspect.career}</p>
                        <p><strong>❤️ Tình yêu:</strong> ${analysis.aspect.love}</p>
                        <p><strong>🍏 Sức khỏe:</strong> ${analysis.aspect.health}</p>
                        <p><strong>💰 Tài chính:</strong> ${analysis.aspect.finance}</p>
                    </div>
                </div>
            `;
        } else {
            html = `
                <div class="lucky-display">
                    <h3>${data.count} Số May Mắn Của Bạn</h3>
                    <p><strong>${data.name}</strong> - ${result.date}</p>
                    <div class="numbers-grid">
            `;
            
            result.numbers.forEach(item => {
                html += `
                    <div class="number-card">
                        <div class="number-value">${item.analysis.number}</div>
                        <div class="number-info">
                            <strong>${item.analysis.name}</strong>
                            <p>${item.analysis.element} - ${item.analysis.color}</p>
                            <p class="lucky-badge ${item.analysis.lucky}">${item.analysis.lucky}</p>
                        </div>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        }
        
        document.getElementById('lucky-result').innerHTML = html;
    } catch (error) {
        alert('Có lỗi xảy ra. Vui lòng thử lại!');
    }
});

// Baby name form
document.getElementById('baby-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        fatherName: document.getElementById('father-name').value,
        motherName: document.getElementById('mother-name').value
    };
    
    try {
        const res = await fetch(`${API_URL}/api/baby-name`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await res.json();
        
        let html = '<h3>Gợi Ý Tên Cho Bé:</h3><div class="name-list">';
        result.suggestions.forEach((name, index) => {
            html += `<div class="name-item">${index + 1}. ${name}</div>`;
        });
        html += '</div>';
        
        document.getElementById('baby-result').innerHTML = html;
    } catch (error) {
        alert('Có lỗi xảy ra. Vui lòng thử lại!');
    }
});

// Load config on page load
loadConfig();
