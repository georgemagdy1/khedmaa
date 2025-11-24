
        // Language Management
        let currentLanguage = 'ar';
        
        function toggleLanguage() {
            currentLanguage = currentLanguage === 'ar' ? 'en' : 'ar';
            updateLanguage();
        }
        
        function updateLanguage() {
            // Update body direction and class
            document.body.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
            document.body.className = currentLanguage === 'ar' ? '' : 'english';
            
            // Update language button
            document.getElementById('langText').textContent = currentLanguage === 'ar' ? 'English' : 'العربية';
            document.getElementById('langIcon').textContent = currentLanguage === 'ar' ? '🌐' : '🌐';
            
            // Update all elements with data attributes
            document.querySelectorAll('[data-ar], [data-en]').forEach(element => {
                element.textContent = element.getAttribute(`data-${currentLanguage}`);
            });
            
            // Update placeholders
            document.querySelectorAll('[data-ar-placeholder], [data-en-placeholder]').forEach(element => {
                const placeholder = element.getAttribute(`data-${currentLanguage}-placeholder`);
                if (placeholder) {
                    element.placeholder = placeholder;
                }
            });
            
            // Update options in selects
            document.querySelectorAll('option[data-ar], option[data-en]').forEach(option => {
                option.textContent = option.getAttribute(`data-${currentLanguage}`);
            });
            
            // Update service names in technicians list if needed
            if (selectedService) {
                updateServiceNameInTechnicians();
            }
            
            // Update dashboard if visible
            if (userRole === 'technician' && document.getElementById('dashboardPage').classList.contains('hidden') === false) {
                renderDashboard();
            }
        }
        
        function updateServiceNameInTechnicians() {
            const serviceNameElement = document.getElementById('selectedServiceName');
            if (serviceNameElement) {
                const service = selectedService;
                const serviceNames = {
                    'نجار': { ar: 'نجار', en: 'Carpenter' },
                    'كهربائي': { ar: 'كهربائي', en: 'Electrician' },
                    'سباك': { ar: 'سباك', en: 'Plumber' },
                    'فني تكييف': { ar: 'فني تكييف', en: 'AC Technician' }
                };
                
                if (serviceNames[service]) {
                    serviceNameElement.textContent = serviceNames[service][currentLanguage];
                }
            }
        }

        // Data
        let currentUser = null;
        let userRole = null;
        let selectedService = null;
        let selectedTechnician = null;
        let bookings = [];
        let users = JSON.parse(localStorage.getItem('users')) || [];

        const technicians = [
            { 
                id: 1, 
                name: { ar: 'أحمد محمد', en: 'Ahmed Mohamed' }, 
                service: { ar: 'نجار', en: 'Carpenter' }, 
                rating: 4.8, 
                reviewCount: 127, 
                visitPrice: 50, 
                location: { ar: 'القاهرة - مدينة نصر', en: 'Cairo - Nasr City' }, 
                distance: { ar: '2 كم', en: '2 km' }, 
                phone: '01012345678', 
                experience: { ar: '10 سنوات', en: '10 years' }, 
                image: '👨‍🔧' 
            },
            { 
                id: 2, 
                name: { ar: 'محمود حسن', en: 'Mahmoud Hassan' }, 
                service: { ar: 'كهربائي', en: 'Electrician' }, 
                rating: 4.9, 
                reviewCount: 203, 
                visitPrice: 60, 
                location: { ar: 'القاهرة - المعادي', en: 'Cairo - Maadi' }, 
                distance: { ar: '3.5 كم', en: '3.5 km' }, 
                phone: '01123456789', 
                experience: { ar: '8 سنوات', en: '8 years' }, 
                image: '⚡' 
            },
            { 
                id: 3, 
                name: { ar: 'سامر علي', en: 'Samir Ali' }, 
                service: { ar: 'سباك', en: 'Plumber' }, 
                rating: 4.7, 
                reviewCount: 150, 
                visitPrice: 55, 
                location: { ar: 'القاهرة - الزمالك', en: 'Cairo - Zamalek' }, 
                distance: { ar: '4 كم', en: '4 km' }, 
                phone: '01234567890', 
                experience: { ar: '12 سنة', en: '12 years' }, 
                image: '🔧' 
            },
            { 
                id: 4, 
                name: { ar: 'خالد سمير', en: 'Khaled Samir' }, 
                service: { ar: 'فني تكييف', en: 'AC Technician' }, 
                rating: 4.6, 
                reviewCount: 98, 
                visitPrice: 70, 
                location: { ar: 'القاهرة - التجمع الخامس', en: 'Cairo - Fifth Settlement' }, 
                distance: { ar: '5 كم', en: '5 km' }, 
                phone: '01345678901', 
                experience: { ar: '7 سنوات', en: '7 years' }, 
                image: '❄️' 
            },
        ];

        // Functions
        function showPage(pageId) {
            document.getElementById('loginPage').classList.add('hidden');
            document.getElementById('loginFormPage').classList.add('hidden');
            document.getElementById('registerPage').classList.add('hidden');
            document.getElementById('servicesPage').classList.add('hidden');
            document.getElementById('techniciansPage').classList.add('hidden');
            document.getElementById('bookingPage').classList.add('hidden');
            document.getElementById('dashboardPage').classList.add('hidden');
            document.getElementById(pageId).classList.remove('hidden');
            
            // Show/hide technician fields based on role selection
            if (pageId === 'registerPage') {
                document.getElementById('registerRole').addEventListener('change', function() {
                    if (this.value === 'technician') {
                        document.getElementById('technicianFields').classList.remove('hidden');
                    } else {
                        document.getElementById('technicianFields').classList.add('hidden');
                    }
                });
            }
        }

        function handleRegister(event) {
            event.preventDefault();
            
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('registerEmail').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const role = document.getElementById('registerRole').value;
            const service = document.getElementById('technicianService').value;
            const experience = document.getElementById('experience').value;
            
            // Validate password match
            if (password !== confirmPassword) {
                alert(currentLanguage === 'ar' ? 'كلمات المرور غير متطابقة!' : 'Passwords do not match!');
                return;
            }
            
            // Check if user already exists
            if (users.find(user => user.email === email)) {
                alert(currentLanguage === 'ar' ? 'البريد الإلكتروني مسجل بالفعل!' : 'Email already registered!');
                return;
            }
            
            // Create new user
            const newUser = {
                id: users.length + 1,
                firstName,
                lastName,
                email,
                phone,
                password,
                role,
                service: role === 'technician' ? service : null,
                experience: role === 'technician' ? experience : null,
                createdAt: new Date().toISOString()
            };
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            alert(currentLanguage === 'ar' ? 'تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.' : 'Account created successfully! You can now login.');
            showPage('loginFormPage');
        }

        function handleLogin(event) {
            event.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const role = document.getElementById('loginRole').value;
            
            // Find user
            const user = users.find(u => u.email === email && u.password === password && u.role === role);
            
            if (user) {
                currentUser = user;
                userRole = role;
                
                document.getElementById('userName').innerText = `${user.firstName} ${user.lastName}`;
                document.getElementById('techName').innerText = `${user.firstName} ${user.lastName}`;
                
                showPage(role === 'customer' ? 'servicesPage' : 'dashboardPage');
            } else {
                alert(currentLanguage === 'ar' ? 'بيانات الدخول غير صحيحة!' : 'Invalid login credentials!');
            }
        }

        function logout() {
            currentUser = null;
            userRole = null;
            selectedService = null;
            selectedTechnician = null;
            showPage('loginPage');
        }

        function selectService(serviceName, color) {
            selectedService = serviceName;
            updateServiceNameInTechnicians();
            const filteredTechs = technicians.filter(tech => 
                tech.service.ar === serviceName || tech.service.en === serviceName
            );
            document.getElementById('techCount').innerText = filteredTechs.length;
            renderTechnicians(filteredTechs, color);
            showPage('techniciansPage');
        }

        function renderTechnicians(techs, color) {
            const list = document.getElementById('techniciansList');
            list.innerHTML = '';
            techs.forEach(tech => {
                const card = document.createElement('div');
                card.className = 'tech-card';
                card.innerHTML = `
                    <div class="tech-content">
                        <div class="tech-avatar" style="background: ${color}33;">${tech.image}</div>
                        <div class="tech-info">
                            <div class="tech-header">
                                <div>
                                    <h3 class="tech-name">${tech.name[currentLanguage]}</h3>
                                    <p class="tech-service">${tech.service[currentLanguage]}</p>
                                </div>
                                <div class="tech-rating">
                                    <div class="rating-stars">
                                        <span class="star">⭐</span>
                                        <span class="rating-number">${tech.rating}</span>
                                    </div>
                                    <div class="rating-count">(${tech.reviewCount} ${currentLanguage === 'ar' ? 'تقييم' : 'reviews'})</div>
                                </div>
                            </div>
                            <div class="tech-details">
                                <div class="tech-detail">
                                    <span class="tech-detail-icon">📍</span> 
                                    ${tech.location[currentLanguage]} (${tech.distance[currentLanguage]})
                                </div>
                                <div class="tech-detail">
                                    <span class="tech-detail-icon">📞</span> 
                                    ${tech.phone}
                                </div>
                                <div class="tech-detail">
                                    <span class="tech-detail-icon">💼</span> 
                                    ${currentLanguage === 'ar' ? 'خبرة:' : 'Experience:'} ${tech.experience[currentLanguage]}
                                </div>
                                <div class="tech-detail">
                                    <span class="tech-detail-icon">💰</span> 
                                    ${currentLanguage === 'ar' ? 'سعر الكشف:' : 'Inspection fee:'} ${tech.visitPrice} ${currentLanguage === 'ar' ? 'جنيه' : 'EGP'}
                                </div>
                            </div>
                            <div class="tech-actions">
                                <button class="btn-book" onclick="bookTechnician(${tech.id})">
                                    ${currentLanguage === 'ar' ? 'حجز الآن' : 'Book Now'}
                                </button>
                                <a href="tel:${tech.phone}" class="btn-call">
                                    ${currentLanguage === 'ar' ? 'اتصال مباشر' : 'Direct Call'} 📞
                                </a>
                            </div>
                        </div>
                    </div>
                `;
                list.appendChild(card);
            });
        }

        function bookTechnician(techId) {
            selectedTechnician = technicians.find(tech => tech.id === techId);
            document.getElementById('bookingTechName').innerText = selectedTechnician.name[currentLanguage];
            document.getElementById('bookingTechService').innerText = selectedTechnician.service[currentLanguage];
            document.getElementById('bookingTechRating').innerText = selectedTechnician.rating;
            document.getElementById('bookingTechReviews').innerText = `(${selectedTechnician.reviewCount} ${currentLanguage === 'ar' ? 'تقييم' : 'reviews'})`;
            document.getElementById('bookingTechPrice').innerText = selectedTechnician.visitPrice;
            document.getElementById('bookingAvatar').innerText = selectedTechnician.image;
            showPage('bookingPage');
        }

        function submitBooking(event) {
            event.preventDefault();
            const problemDesc = document.getElementById('problemDesc').value;
            const preferredDate = document.getElementById('preferredDate').value;
            const preferredTime = document.getElementById('preferredTime').value;

            const newBooking = {
                id: bookings.length + 1,
                technician: selectedTechnician,
                customer: currentUser,
                problemDesc,
                preferredDate,
                preferredTime,
                status: 'pending'
            };
            bookings.push(newBooking);
            alert(currentLanguage === 'ar' ? 'تم إرسال طلب الحجز بنجاح!' : 'Booking request sent successfully!');
            showPage('servicesPage');
        }

        function renderDashboard() {
            const pendingBookings = bookings.filter(b => b.status === 'pending');
            const acceptedBookings = bookings.filter(b => b.status === 'accepted');
            document.getElementById('pendingCount').innerText = pendingBookings.length;
            document.getElementById('acceptedCount').innerText = acceptedBookings.length;
            document.getElementById('totalCount').innerText = bookings.length;

            const list = document.getElementById('bookingsList');
            list.innerHTML = '';
            if (bookings.length === 0) {
                list.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">📭</div>
                        <p>${currentLanguage === 'ar' ? 'لا توجد طلبات حجز حالياً.' : 'No booking requests currently.'}</p>
                    </div>
                `;
                return;
            }
            bookings.forEach(booking => {
                const statusText = {
                    'pending': currentLanguage === 'ar' ? 'قيد الانتظار' : 'Pending',
                    'accepted': currentLanguage === 'ar' ? 'مقبول' : 'Accepted',
                    'rejected': currentLanguage === 'ar' ? 'مرفوض' : 'Rejected'
                };
                
                const item = document.createElement('div');
                item.className = 'booking-item';
                item.innerHTML = `
                    <div class="booking-header">
                        <div class="booking-customer">${booking.customer.firstName} ${booking.customer.lastName}</div>
                        <div class="booking-status ${booking.status}">${statusText[booking.status]}</div>
                    </div>
                    <div class="booking-problem">
                        <div class="problem-label">${currentLanguage === 'ar' ? 'وصف المشكلة:' : 'Problem Description:'}</div>
                        <div class="problem-text">${booking.problemDesc}</div>
                    </div>
                    <div class="booking-details">
                        <div class="tech-detail">
                            <span class="tech-detail-icon">📅</span> 
                            ${currentLanguage === 'ar' ? 'التاريخ:' : 'Date:'} ${booking.preferredDate}
                        </div>
                        <div class="tech-detail">
                            <span class="tech-detail-icon">🕐</span> 
                            ${currentLanguage === 'ar' ? 'الوقت:' : 'Time:'} ${booking.preferredTime}
                        </div>
                    </div>
                    ${booking.status === 'pending' ? `
                    <div class="booking-actions">
                        <button class="btn-accept" onclick="updateBookingStatus(${booking.id}, 'accepted')">
                            ${currentLanguage === 'ar' ? 'قبول' : 'Accept'} ✅
                        </button>
                        <button class="btn-reject" onclick="updateBookingStatus(${booking.id}, 'rejected')">
                            ${currentLanguage === 'ar' ? 'رفض' : 'Reject'} ❌
                        </button>
                    </div>` : ''}
                `;
                list.appendChild(item);
            });
        }

        function updateBookingStatus(bookingId, status) {
            const booking = bookings.find(b => b.id === bookingId);
            if (booking) {
                booking.status = status;
                renderDashboard();
            }
        }

        // Initial setup
        updateLanguage();
