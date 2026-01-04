const EXCHANGE_RATE = 1.95583; // 1 EUR = 1.95583 BGN
const totalInput = document.getElementById('totalInput');
const paidInput = document.getElementById('paidInput');
const totalCurrencySymbol = document.getElementById('totalCurrencySymbol');
const paidCurrencySymbol = document.getElementById('paidCurrencySymbol');
const euroResult = document.getElementById('euroResult');
const levResult = document.getElementById('levResult');

function parseNumber(value) {
    if (!value || value === '') return 0;
    // Replace comma with dot for parsing (Bulgarian format)
    const normalized = value.toString().replace(',', '.');
    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? 0 : parsed;
}

function getActiveCurrency(target) {
    const toggle = document.getElementById(target + 'CurrencyToggle');
    const activeBtn = toggle.querySelector('.currency-toggle-btn.active');
    return activeBtn ? activeBtn.dataset.currency : 'lev';
}

function convertToLev(amount, currency) {
    if (currency === 'euro') {
        return amount * EXCHANGE_RATE;
    }
    return amount; // Already in Lev
}

function updateCurrencySymbol(target, symbolElement) {
    const currency = getActiveCurrency(target);
    symbolElement.textContent = currency === 'euro' ? '€' : 'лв';
}

function calculate() {
    const totalAmount = parseNumber(totalInput.value);
    const paidAmount = parseNumber(paidInput.value);
    
    // Convert both to Lev for calculation
    const totalInLev = convertToLev(totalAmount, getActiveCurrency('total'));
    const paidInLev = convertToLev(paidAmount, getActiveCurrency('paid'));
    
    const changeLev = Math.max(0, paidInLev - totalInLev);
    const euroValue = changeLev / EXCHANGE_RATE;
    
    // Format Euro with 2 decimal places
    euroResult.textContent = euroValue.toFixed(2) + ' €';
    
    // Format Lev with 2 decimal places (smaller text)
    levResult.textContent = changeLev.toFixed(2) + ' лв';
}

function clearInput() {
    totalInput.value = '';
    paidInput.value = '';
    totalInput.focus();
    calculate();
}

// Handle currency toggle button clicks
document.querySelectorAll('.currency-toggle-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const target = this.dataset.target;
        const toggle = document.getElementById(target + 'CurrencyToggle');
        
        // Remove active class from all buttons in this toggle
        toggle.querySelectorAll('.currency-toggle-btn').forEach(b => {
            b.classList.remove('active');
        });
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Update currency symbol
        const symbolElement = target === 'total' ? totalCurrencySymbol : paidCurrencySymbol;
        updateCurrencySymbol(target, symbolElement);
        
        // Recalculate
        calculate();
    });
});

// Calculate on input
totalInput.addEventListener('input', calculate);
paidInput.addEventListener('input', calculate);

// Initialize currency symbols
updateCurrencySymbol('total', totalCurrencySymbol);
updateCurrencySymbol('paid', paidCurrencySymbol);

// Calculate on page load
calculate();

