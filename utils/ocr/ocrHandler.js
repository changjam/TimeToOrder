export async function getMenuByImage(imageName, imageBase64Encode) {
    try {
      const response = await $fetch('http://127.0.0.1:8000/ocr_detect', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_name: imageName,
          image_base64_encode: imageBase64Encode
        })
      });
  
      return response;
    } catch (error) {
        alert("讀取圖片時出錯，請稍後再試")
        console.log(error)
    }
  }
  