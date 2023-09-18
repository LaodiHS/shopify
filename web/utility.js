export function numberToWords(num) {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const thousands = ['', 'Thousand', 'Million', 'Billion', 'Trillion', 'Quadrillion'];
  
    function convertThreeDigits(num) {
        let result = '';
        let hundred = Math.floor(num / 100);
        let remainder = num % 100;
  
        if (hundred > 0) {
            result += ones[hundred] + ' Hundred';
            if (remainder > 0) {
                result += ' ';
            }
        }
  
        if (remainder > 10 && remainder < 20) {
            result += teens[remainder - 11];
        } else {
            let ten = Math.floor(remainder / 10);
            remainder = remainder % 10;
            if (ten > 0) {
                result += tens[ten];
                if (remainder > 0) {
                    result += ' ';
                }
            }
            if (remainder > 0) {
                result += ones[remainder];
            }
        }
  
        return result;
    }
  
    if (num === 0) {
        return 'Zero';
    }
  
    let result = '';
    for (let i = 0; i < thousands.length && num > 0; i++) {
        let chunk = num % 1000;
        if (chunk !== 0) {
            result = convertThreeDigits(chunk) + ' ' + thousands[i] + ' ' + result;
        }
        num = Math.floor(num / 1000);
    }
  
    return result.trim();
}

// Example usage:
console.log(numberToWords(51)); 