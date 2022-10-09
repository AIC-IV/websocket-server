class HelperBackendService {
    generateRandomColor() {
        const letters = "0123456789ABCDEF";

        let color = "#";
        while (color.length < 7) {
            color += letters[Math.floor(Math.random() * 16)];
        }

        return color;
    }
}

module.exports = new HelperBackendService();
