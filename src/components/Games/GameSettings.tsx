interface GameSettingsProps {
    rcMatch: boolean,
    nMatch: boolean,
    setRcMatch: React.Dispatch<React.SetStateAction<boolean>>,
    setNMatch: React.Dispatch<React.SetStateAction<boolean>>,
    clearColorGuides: () => void,
    clearNumberGuides: () => void,
    selectRowNColumn: () => void,
    sameNumbers: () => void
}

const GameSettins:React.FC<GameSettingsProps> = ({rcMatch , nMatch , setRcMatch , setNMatch , clearColorGuides , clearNumberGuides , selectRowNColumn , sameNumbers}) => {
    function handleColorGuides (rcMatch:boolean) {
        setRcMatch(!rcMatch)
        if (rcMatch) {
            clearColorGuides()
        } else {
            selectRowNColumn()
        }
    }
    function handleNumberGuides (nMatch:boolean) {
        setNMatch(!nMatch)
        if (nMatch) {
            clearNumberGuides()
        } else {
            sameNumbers()
        }
    }
    return (
        <div className="game-settings">
            <div className="window">
                <div className="game-setting">
                    <label htmlFor="rc-match">Row/Column matching</label>
                    <input type="checkbox" id="rc-match" defaultChecked={rcMatch} onChange={() => handleColorGuides(rcMatch)}/>
                </div>
                <div className="game-setting">
                    <label htmlFor="n-match">Number matching</label>
                    <input type="checkbox" id="n-match" defaultChecked={nMatch} onChange={() => handleNumberGuides(nMatch)}/>
                </div>
            </div>
            {/* <div className="auxiliar"></div> */}
        </div>
    )
}

export default GameSettins