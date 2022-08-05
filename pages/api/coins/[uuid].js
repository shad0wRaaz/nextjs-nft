import axios from 'axios';

export default async function handler (req, res){
    const { query: { uuid }} = req;
    
    if(!uuid) {
        res.status(404).json(JSON.stringify('Invalid coin id'));
    }
    const options = {
        method: 'GET',
        url: `https://coinranking1.p.rapidapi.com/coin/${uuid}/price`,
        params: { referenceCurrencyUuid: 'yhjMzLPhuIDl' },
        headers: {
                'X-RapidAPI-Host': process.env.NEXT_PUBLIC_RAPIDAPI_HOST,
                'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY
            }
    };
    // res.status(200).json(JSON.stringify(options))
    await axios.request(options).then((response) => {
        
        res.status(200).json(response);
        })
        .catch((err) => {
            res.status(404).json(err.message);
        });
    
                        
}