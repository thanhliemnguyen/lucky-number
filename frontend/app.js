const API_URL = 'http://localhost:3000'; // Local development

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
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const resultDiv = document.getElementById('lucky-result');
    
    // Show loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = '🔮 Đang tính toán...';
    resultDiv.innerHTML = '<div class="loading">✨ Đang phân tích số may mắn của bạn...</div>';
    
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
        
        // Hiển thị năng lượng ngày
        if (result.todayEnergy) {
            html += `
                <div style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;padding:15px;border-radius:10px;margin-bottom:20px;text-align:center;">
                    <strong>🌟 Năng lượng ngày hôm nay: ${result.todayEnergy.number}</strong>
                    <p style="margin:5px 0 0 0;">${result.todayEnergy.meaning}</p>
                </div>
            `;
        }
        
        // Hiển thị thông báo AI
        if (result.aiPowered) {
            html += '<p style="color:#4CAF50;margin-bottom:15px;text-align:center;">✨ Số may mắn được AI phân tích cá nhân theo tên và ngày sinh của bạn</p>';
        }
        
        if (data.count === 1) {
            const analysis = result.numbers[0].analysis;
            const explanation = result.numbers[0].explanation;
            
            html += `
                <div class="lucky-display">
                    <h3>Số May Mắn Của Bạn</h3>
                    <div class="lucky-number">${analysis.number}</div>
                    <p><strong>${data.name}</strong> - ${result.date}</p>
            `;
            
            // Hiển thị giải thích AI
            if (explanation) {
                html += `
                    <div style="background:#f0f7ff;padding:15px;border-radius:10px;margin:15px 0;border-left:4px solid #4CAF50;">
                        <p style="margin:0 0 10px 0;color:#4CAF50;font-weight:bold;">✨ Tại sao số này may mắn hôm nay?</p>
                        <p style="margin:0 0 10px 0;">${explanation.explanation}</p>
                        <p style="margin:0 0 10px 0;"><strong>🔥 Năng lượng:</strong> ${explanation.energy}</p>
                        <p style="margin:0 0 10px 0;color:#666;"><strong>💡 Lời khuyên:</strong> ${explanation.advice}</p>
                        ${explanation.bestTime ? `<p style="margin:0;color:#e74c3c;"><strong>⏰ Thời gian tốt nhất:</strong> ${explanation.bestTime}</p>` : ''}
                    </div>
                `;
            }
            
            html += `
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
        resultDiv.innerHTML = '<div class="error">❌ Có lỗi xảy ra. Vui lòng thử lại!</div>';
    } finally {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Xem Số May Mắn';
    }
});

// Baby name form
document.getElementById('baby-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const resultDiv = document.getElementById('baby-result');
    
    // Show loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = '👶 Đang tạo tên...';
    resultDiv.innerHTML = '<div class="loading">🌟 AI đang phân tích và tạo tên hay cho bé...</div>';
    
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
        
        let html = '<h3>Gợi Ý Tên Cho Bé:</h3>';
        
        if (result.aiPowered) {
            html += '<p style="color:#4CAF50;margin-bottom:15px;">✨ Được tạo bởi AI - Phân tích sâu theo phong thủy</p>';
            html += '<div class="name-list">';
            result.suggestions.forEach((item, index) => {
                const genderIcon = item.gender === 'Nam' ? '👦' : '👧';
                html += `
                    <div class="name-item enhanced" style="border-left:3px solid #4CAF50;padding:15px;margin-bottom:20px;background:#f8fff8;">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                            <strong style="font-size:1.3em;color:#667eea;">${genderIcon} ${item.name}</strong>
                            <span style="background:#4CAF50;color:white;padding:3px 8px;border-radius:12px;font-size:0.9em;">${item.score}</span>
                        </div>
                        <p><strong>🌿 Ý nghĩa:</strong> ${item.meaning}</p>
                        <p><strong>✨ Ngũ hành:</strong> ${item.element}</p>
                        ${item.reason ? `<p><strong>🎯 Lý do:</strong> ${item.reason}</p>` : ''}
                    </div>
                `;
            });
        } else {
            html += '<div class="name-list">';
            result.suggestions.forEach((name, index) => {
                html += `<div class="name-item">${index + 1}. ${name}</div>`;
            });
        }
        html += '</div>';
        
        document.getElementById('baby-result').innerHTML = html;
    } catch (error) {
        resultDiv.innerHTML = '<div class="error">❌ Có lỗi xảy ra. Vui lòng thử lại!</div>';
    } finally {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Tạo Tên';
    }
});

// Load config on page load
loadConfig();

// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();
