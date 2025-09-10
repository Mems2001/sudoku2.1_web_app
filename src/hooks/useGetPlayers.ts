import { useEffect, useState } from "react"
import { PlayerData } from "../models/dbTypes"
import { Ids } from "../models/types"
import { PlayersServices } from "../services"

interface UseGetPlayersProps {
    game_id: Ids
}

/**
 * This function gets called two times. Once the "MultiplayerGame" component is rendered and it gets the list of players signed to the game, and then again when the list is set as a local state it verifies if the current user is a player of the game and update the "inList" state according to the case. This is crutial because the soduku game will be accesible only to those users who are verified players of the game.
 * @param players - An array, the list of players of the game
 */
export const useGetPlayers = ({game_id}: UseGetPlayersProps) => {
    const [players , setPlayers] = useState<PlayerData[]>([])
    const [inList , setInList] = useState<boolean>(false)

    const handlePlayers = (data?: PlayerData , dataA?: PlayerData[]) => {
        // console.log('players data:', data, dataA)
        try {
            if (data) { // When data is an object then it pushes the object to the previous array
                setPlayers(prevPlayers => [...prevPlayers , data])
            } else { //If data is an array its values subtitue the previous array
                setPlayers(() => dataA? [...dataA] : [])
            }
        } catch (error) {
            console.error(error)
        }
    }

    async function isPlayerOnList () {
        try {
            const res = await PlayersServices.getPlayerIsOnList(game_id)
            console.log('player on list api response:', res)
            if (res.status === 200) {
                setInList(() => true)
                console.log('the player is on the list')
            } else {
                setInList(() => false)
                console.log('the player is not on the list')
            }
        } catch(error) {
            console.log("the player is not on the list")
            setInList(() => false)
        } 
           
    }

    async function getPlayers () {
        try {
            if (players.length === 0) {
                const res = await PlayersServices.getGamePlayersList(game_id)
                console.log( 'players list api response:', res.data)
                await isPlayerOnList()
                handlePlayers(undefined , res.data)
            } else {
                console.log('current players:', players)
                await isPlayerOnList()
            }
        } catch (err) {
            console.error(err)
        }
    }

    useEffect (
          () => {
                (async() => { await getPlayers() }
                )
              console.warn('useEffect players list:', players, 'player on list:', inList)
            }, [players]
        )

    return {players, setPlayers, handlePlayers, inList, setInList}
}