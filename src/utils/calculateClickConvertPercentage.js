const calculateClickConvertionPercentage = (ctr) => {
    if (typeof ctr !== 'number') {
        return 'Nilai CTR tidak valid';
    }

    let percentage = ctr * 100;
    percentage = percentage.toFixed(2);
    return `${percentage}%`;
};

export default calculateClickConvertionPercentage;