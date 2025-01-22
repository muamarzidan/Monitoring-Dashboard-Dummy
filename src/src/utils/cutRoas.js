const cutRoas = (roas) => {
    if (typeof roas !== 'number') {
        return 'Invalid nilai';
    }

    let cut = roas.toFixed(2);
    return cut;
}

export default cutRoas;