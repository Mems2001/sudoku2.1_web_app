function NumbersWheel() {
    return (
        <div className="numbers-wheel">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                <div key={number} className="number">{number}</div>
            ))}
        </div>
    )
}

export default NumbersWheel