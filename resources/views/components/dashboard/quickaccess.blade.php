 <!-- Quick Access Section -->
 <h2 class="section-title balance">Quick Access</h2>
 <div class="tools-grid quick-access-grid">
     <a href="{{ route('paystack.init') }}" class="text-decoration-none text-muted">
         <div class="tool-card">
             <div class="tool-icon financial-icon">
                 <i class="fas fa-wallet"></i>
             </div>
             <div class="tool-label">Fund Account</div>
         </div>
     </a>
     <a href="{{ route('airtime.buy') }}" class="text-decoration-none text-muted">

         <div class="tool-card">
             <div class="tool-icon financial-icon">
                 <i class="fas fa-mobile-alt"></i>
             </div>
             <div class="tool-label">Buy Airtime</div>
         </div>
     </a>
     <a href="{{ route('data.buy') }}" class="text-decoration-none text-muted">

         <div class="tool-card">
             <div class="tool-icon financial-icon">
                 <i class="fas fa-wifi"></i>
             </div>
             <div class="tool-label">Buy Data</div>
         </div>
     </a>
     <div class="tool-card">
         <div class="tool-icon financial-icon">
             <i class="fas fa-money-bill-wave"></i>
         </div>
         <div class="tool-label">Earn Money</div>
     </div>
     <div class="tool-card">
         <div class="tool-icon tech-icon">
             <i class="fas fa-desktop"></i>
         </div>
         <div class="tool-label">Cybercafe</div>
     </div>
     <div class="tool-card">
         <div class="tool-icon academic-icon">
             <i class="fas fa-question-circle"></i>
         </div>
         <div class="tool-label">Past Questions</div>
     </div>
     {{-- <a href="{{ route('cgpa.calculator') }}" class="text-decoration-none text-muted"> --}}

     <div class="tool-card">
         <div class="tool-icon academic-icon">
             <i class="fas fa-calculator"></i>
         </div>
         <div class="tool-label">GPA Calculator</div>
     </div>
     {{-- </a> --}}
     <div class="tool-card">
         <div class="tool-icon financial-icon">
             <i class="fas fa-money-check"></i>
         </div>
         <div class="tool-label">Withdraw Funds</div>
     </div>
 </div>
