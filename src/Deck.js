import { useEffect , useRef, useState} from 'react' 
import axios from 'axios'
import Card from './Card'

const Deck=()=>{

    const deckID = useRef()
    const interval = useRef()
    const trackRendering = useRef(0)
    const [clicked, setClicked] = useState(false)
    const [image, setImage] = useState([])

    useEffect(()=>{
        trackRendering.current = trackRendering.current + 1
    })
    console.log(trackRendering)

    useEffect(function run(){
        console.log('useffect getting deck id')
        async function shuffleDeck(){
            const shuffleDeck = 'http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1';
            const data = await axios.get(shuffleDeck)
            deckID.current = data.data.deck_id
        }
        shuffleDeck()
    } ,[])



    async function getCard(){
        console.log('inside async/setinterval')
        try{
            await axios.get(`http://deckofcardsapi.com/api/deck/${deckID.current}/draw/?count=2`).then(
                data => {
                    //setImage cause a rerender
                    setImage(image => [...image, data.data.cards[0].image] )
                }
            )
        }catch(e){
            console.log(e)
        }
    
    }


    //Because clearInterval clears it, it does not have 2 setIntervals running when i start again.
    //thus no need to clean up.
    function gCard(){
        console.log('gcard')
   
        interval.current = setInterval( getCard, 5000)
         
        setClicked(true)
    }

    function clearI(){
        console.log('clearI')
        clearInterval(interval.current)
        setClicked(false)
    }

    return (
        <div>
        
            <button onClick={clicked ? clearI : gCard}>{ clicked ? 'detener' : 'comienzo'}</button>
            {image.map((img, idx) => (
                <Card key={idx} image={img}></Card>
            ))}
            
        </div>
    )
}
export default Deck