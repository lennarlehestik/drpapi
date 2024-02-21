const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const cors = require('cors');


const app = express();
app.use(cors({
  origin: ['http://localhost:3000',
          'https://disputeresolutionproject.web.app',
        'https://daodrp.com']
}));

const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), async (req, res) => {
    const file = req.file;
    
    if (!file) return res.status(400).send('No file uploaded');
    
    try {
      // Pin file to IPFS via Pinata
      const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
      
      let form = new FormData();
      form.append('file', file.buffer, { filename: file.originalname, contentType: file.mimetype });
      
      const response = await axios.post(url, form, {
        headers: {
          ...form.getHeaders(), // This will set the proper 'Content-Type' header with the correct 'boundary'
          'pinata_api_key': 'INESRT KEY',
          'pinata_secret_api_key': 'INSERT KEY',
        },
      });
      
      res.json(response.data);
    } catch (error) {
      res.status(500).send('Error pinning file to IPFS: ' + error.message);
    }
  });
  

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
