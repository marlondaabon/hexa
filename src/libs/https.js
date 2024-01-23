
const HttpPostGet = async (url, body) => {

    try{
        const req = await fetch(url, {
            method: "POST",
            body,
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
        });

        const response = await req.text();
        return response;

    }catch(err){
        throw Error(err);
    }
}



const HttpPostGetPhotos = async (url, data) => {

    try{
        const req = await fetch(url, {
            method: "POST",
            body: data,
            headers: { 
                "Accept": "*/*",
                "Content-Type": "multipart/form-data" 
            },
        });

        const response = await req.text();
        return response;

    }catch(err){
        throw Error(err);
    }
}

const HttpPost = async (url, body) => {

    try{

        const req = await fetch(url, {
            method: "POST",
            body
        });

        const response = await req.json();

        return response;

    }catch(err){
        throw Error(err);
    }
}


export { HttpPost, HttpPostGet, HttpPostGetPhotos };