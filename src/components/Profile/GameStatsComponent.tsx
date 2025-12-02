import React, { useState } from "react"
import { GameStats } from "../../models/dbTypes"

interface GameStatsProps {
    game_stats: GameStats
}

const GameStatsComponent:React.FC<GameStatsProps> = ({game_stats}) => {
    const [statOption, setStatOption] = useState<'total'|'detailed'>('total')
    const [difficultiesShown, setDifficultiesShown] = useState<string[]>([])

    function handleGameType(game_type: keyof GameStats) {
        switch (game_type) {
            case "single_player":
                return "Single player games"
            case 'time_vs':
                return "Vs time-attack games"
            case 'cooperative':
                return "Cooperative games"
        }
    }

    function processDifficulties(keys:string[]) {
        const difficulties = ["Novice", "Easy", "Normal", "Hard", "Expert", "Master"]
        const response = []

        for (const difficulty of difficulties) {
            for (const key of keys) {
                if (key.includes(difficulty.toLowerCase())) {
                    response.push(difficulty)
                    break
                }
            }
        }

        return response
    }

    function filterByDiffculty(difficulty:string, stats:string[]) {
        // const order = ["started", "won", "lost", "time"]
        const response = []

        for (const stat of stats) {
            if (stat.includes(difficulty.toLowerCase())) response.push(stat)
        }

        return response
    }

    function parseStat(stat:string) {
        if (stat.includes('errors')) return 'errors'
        return stat.split('_')[2]
    }

    // Total stats

    function getAllGamesStat(game_stats:GameStats, type:string, game_type?:string) {
        let response = 0

        if (game_type) {
            for (const key of Object.keys(game_stats)) {
                // console.warn(key)
                if (key === game_type) {
                    for (const key2 of Object.keys(game_stats[key as keyof GameStats]!)) {
                        // console.warn(key2)
                        if (key2.includes(type)) response += game_stats[key as keyof GameStats]![key2]
                    }
                }
            }
            return response
        }

        for (const key of Object.keys(game_stats)) {
            // console.warn(key)
            for (const key2 of Object.keys(game_stats[key as keyof GameStats]!)) {
                // console.warn(key2)
                if (key2.includes(type)) response += game_stats[key as keyof GameStats]![key2]
            }
        }
        return response
    }

    function getWinRatio (game_stats:GameStats, game_type?: string, difficulty?:string) {
        let started = 0
        let won = 0

        if (game_type && difficulty) {
            for (const key of Object.keys(game_stats)) {
                // console.warn(key)
                if (key === game_type) {
                    for (const key2 of Object.keys(game_stats[key as keyof GameStats]!)) {
                        // console.warn(key2)
                        if (key2.includes(difficulty)) {
                            if (key2.includes('started')) started += game_stats[key as keyof GameStats]![key2]
                            if (key2.includes('won')) won += game_stats[key as keyof GameStats]![key2]
                        }
                    }
                }
            }
            return (won/started * 100).toString() + '%'
        }

        if (game_type) {
            for (const key of Object.keys(game_stats)) {
                // console.warn(key)
                if (key === game_type) {
                    for (const key2 of Object.keys(game_stats[key as keyof GameStats]!)) {
                        // console.warn(key2)
                        if (key2.includes('started')) started += game_stats[key as keyof GameStats]![key2]
                        if (key2.includes('won')) won += game_stats[key as keyof GameStats]![key2]
                    }
                }
            }
            return (won/started * 100).toString() + '%'
        }

        for (const key of Object.keys(game_stats)) {
            // console.warn(key)
            for (const key2 of Object.keys(game_stats[key as keyof GameStats]!)) {
                // console.warn(key2)
                if (key2.includes('started')) started += game_stats[key as keyof GameStats]![key2]
                if (key2.includes('won')) won += game_stats[key as keyof GameStats]![key2]
            }
        }
        return (won/started * 100).toString() + '%'
    }

    function getAverageTime(game_stats:GameStats, game_type?:string, difficulty?:string) {
        let started = 0
        let total_time = 0

        if (game_type && difficulty) {
            for (const key of Object.keys(game_stats)) {
                // console.warn(key)
                if (key === game_type) {
                    for (const key2 of Object.keys(game_stats[key as keyof GameStats]!)) {
                        // console.warn(key2)
                        if (key2.includes(difficulty)) {
                            if (key2.includes('started')) started += game_stats[key as keyof GameStats]![key2]

                            if (key2.includes('time')) total_time += game_stats[key as keyof GameStats]![key2]
                        }
                    }
                }
            }
            return (total_time/started).toString() + 's'
        }

        if (game_type) {
            for (const key of Object.keys(game_stats)) {
                // console.warn(key)
                if (key === game_type) {
                    for (const key2 of Object.keys(game_stats[key as keyof GameStats]!)) {
                        // console.warn(key2)
                        if (key2.includes('started')) {
                            started += game_stats[key as keyof GameStats]![key2]
                        }
                        if (key2.includes('time')) {
                            total_time += game_stats[key as keyof GameStats]![key2]
                        }
                    }
                }
            }
            return (total_time/started).toString() + 's'
        }

        for (const key of Object.keys(game_stats)) {
            // console.warn(key)
            for (const key2 of Object.keys(game_stats[key as keyof GameStats]!)) {
                // console.warn(key2)
                if (key2.includes('started')) {
                    started += game_stats[key as keyof GameStats]![key2]
                }
                if (key2.includes('time')) {
                    total_time += game_stats[key as keyof GameStats]![key2]
                }
            }
        }
        return (total_time/started).toString() + 's'
    }

    function removeDifficulty(difficulty:string) {
        const index = difficultiesShown.indexOf(difficulty)
        const response = difficultiesShown
        response.splice(index, 1)
        return setDifficultiesShown([...response])
    }

    return (
        <div className="game-stats">
            <h3 className="profile-title">Game Stats</h3>
            <div className="game-stats-options">
                <button className={`game-stats-option ${statOption !== 'total' && 'disabled'}`} onClick={() => setStatOption('total')}>
                    <h4>Total</h4>
                </button>
                <button className={`game-stats-option ${statOption !== 'detailed' && 'disabled'}`} onClick={() => setStatOption('detailed')}>
                    <h4>Detailed</h4>
                </button>
            </div>
            {statOption === 'detailed' ? (
                <div className="detailed-stats">
                    {Object.keys(game_stats).map(key => (
                        <div key={key} className="stats-container">
                            <h4>{handleGameType(key as keyof GameStats)}</h4>
                            <div className="stat">
                                <span>Games started</span>
                                <span>{getAllGamesStat(game_stats, 'started', key)}</span>
                            </div>
                            <div className="stat">
                                <span>Games won</span>
                                <span>{getAllGamesStat(game_stats, 'won', key)}</span>
                            </div>
                            <div className="stat">
                                <span>Games lost</span>
                                <span>{getAllGamesStat(game_stats, 'lost', key)}</span>
                            </div>
                            <div className="stat">
                                <span>Total errors</span>
                                <span>{getAllGamesStat(game_stats, 'errors', key)}</span>
                            </div>
                            <div className="stat">
                                <span>Time played</span>
                                <span>{getAllGamesStat(game_stats, 'time', key) + 's'}</span>
                            </div>
                            <div className="stat">
                                <span>Average game time</span>
                                <span>{getAverageTime(game_stats, key)}</span>
                            </div>
                            <div className="stat">
                                <span>Win ratio</span>
                                <span>{getWinRatio(game_stats, key)}</span>
                            </div>
                            {processDifficulties(Object.keys(game_stats[key as keyof GameStats]!)).map(key2 => (
                                <div className="difficulty-container">
                                    <div className="difficulty-label">
                                        <h5>{key2}</h5>
                                        {difficultiesShown.includes(key2) ? (
                                            <i className="fa-solid fa-xmark" onClick={() => removeDifficulty(key2)}></i>
                                        ) : (
                                            <i className="fa-solid fa-caret-down" onClick={() => setDifficultiesShown([...difficultiesShown, key2])}></i>
                                        )}
                                    </div>
                                    {filterByDiffculty(key2, Object.keys(game_stats[key as keyof GameStats]!)).map(key3 => (
                                        <div key={key3} className={`stat ${difficultiesShown.includes(key2) ? '' : 'hidden'}`}>
                                            <span>{parseStat(key3)}</span>
                                            <span>{game_stats[key as keyof GameStats]![key3]}</span>
                                        </div>
                                    ))}
                                    <div className={`stat ${difficultiesShown.includes(key2) ? '' : 'hidden'}`}>
                                        <span>average game time</span>
                                        <span>{getAverageTime(game_stats, key, key2.toLowerCase())}</span>
                                    </div>
                                    <div className={`stat ${difficultiesShown.includes(key2) ? '' : 'hidden'}`}>
                                        <span>win ratio</span>
                                        <span>{getWinRatio(game_stats, key, key2.toLowerCase())}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="stats-container">
                    <div className="stat">
                        <span>Games started</span>
                        <span>{getAllGamesStat(game_stats, 'started')}</span>
                    </div>
                    <div className="stat">
                        <span>Games won</span>
                        <span>{getAllGamesStat(game_stats, 'won')}</span>
                    </div>
                    <div className="stat">
                        <span>Games lost</span>
                        <span>{getAllGamesStat(game_stats, 'lost')}</span>
                    </div>
                    <div className="stat">
                        <span>Toral errors</span>
                        <span>{getAllGamesStat(game_stats, 'errors')}</span>
                    </div>
                    <div className="stat">
                        <span>Time played</span>
                        <span>{getAllGamesStat(game_stats, 'time_played') + 's'}</span>
                    </div>
                    <div className="stat">
                        <span>Average game time</span>
                        <span>{getAverageTime(game_stats)}</span>
                    </div>
                    <div className="stat">
                        <span>Win ratio</span>
                        <span>{getWinRatio(game_stats)}</span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default GameStatsComponent