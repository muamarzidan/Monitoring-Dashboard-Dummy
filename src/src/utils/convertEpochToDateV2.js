const convertEpochToDatet = (time) => {
    const date = new Date(time * 1000);
    return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

export default convertEpochToDatet;