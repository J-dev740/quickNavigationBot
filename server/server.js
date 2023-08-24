const express = require('express');
const axios=require('axios');
const bodyParser = require('body-parser');
// const http = require('http');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.post('/send-data', (req, res) => {
const data = req.body; // Extract data from request body
// const filtered_data=data.map(function(item) {
//     return [item.row,item.col];
// });
console.log(data);
console.log("END");
const filtered_data=[[]];
filtered_data.pop();
// console.log(data[4]);

    let previous_row_diff=0;
    let previous_col_diff=0;
    var row_diff,col_diff;
    for(let i=0; i<(data.length)-1;i++)
    {
        if(i==0){
            previous_row_diff=data[i][0]-data[i+1][0];
            previous_col_diff=data[i][1]-data[i+1][1];
            filtered_data.push(data[i]);      
        }
        else  {
            row_diff=data[i][0]-data[i+1][0];
            col_diff=data[i][1]-data[i+1][1];
            if(row_diff!=0&&previous_col_diff!=0){

            filtered_data.push(data[i]);
            previous_col_diff=col_diff;
            previous_row_diff=row_diff;

            }
            else if (col_diff!=0&&previous_row_diff!=0){
            
            filtered_data.push(data[i]);
            previous_col_diff=col_diff;
            previous_row_diff=row_diff;

            }
            

        }

    }
    filtered_data.push(data[data.length-1]);
    console.log(filtered_data);
const esp32Url = 'http://192.168.103.39/data';

// const esp32Req = http.request(esp32Url, {
// method: 'POST',
// headers: {
// 'Content-Type': 'application/json'
// },
// body: JSON.stringify({'data':data}),
// }, (esp32Res) => {
//     // console.log(esp32Res);
// });

// // esp32Req.write(JSON.stringify({ data:data }));
// esp32Req.end();
const postData =JSON.stringify(filtered_data);
// const postData="hello how are you";
// const options={
// setTimeout:3000,
// hostname:'192.168.180.108',
// port:80,
// path:'/data',
// method:'POST',
// rejectUnauthorized:false,
// headers:{
//     'Content-Type': 'application/json',
//     'Content-lenght':Buffer.byteLength(postData),
// },
// };
// const espreq=http.request(options,(res)=>{}).on('error',function(err){
//     console.log("errror: "+err.message);
// });
// req.on('error',(e)=>{
// console.error(e.message);
// });
// espreq.write(postData);
// espreq.end();

// const data = { foo: 'bar', baz: 'qux' }; // replace with your data
const headers={
    'Content-Type':'application/json',
    // 'Content-lenght':Buffer.byteLength(postData),
}

axios.post(esp32Url, postData,{headers,timeout:5000})
.then((response) => {
console.log(`Server responded with status ${response.status}`);
console.log(response.data); // response data from the server
})
.catch((error) => {
console.error(`Error communicating with server: ${error.message}`);
});

// res.send('Data sent to ESP32');
 });

app.listen(5000, () => {
console.log('API server listening on port 5000');
});