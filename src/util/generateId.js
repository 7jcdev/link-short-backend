const generateId = () => {
    return Math.random().toString(36).substring(2, 5);// + Date.now().toString(32);
}

export default generateId;