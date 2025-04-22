function divide(a, b) {
    try {
        
        if (b === 0) {
            throw new Error('Không thể chia cho 0');
        }
        console.log(a/b);
    } catch (error) {
        console.error('Lỗi:', error.message);
    }
}

divide(2,0);
divide(2,2);