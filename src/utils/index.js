class Tools {
  static compressFile(file) {
    console.log(`正在压缩文件：${file.name}`);

    let compressedFile;

    if (file.type.includes('image')) {
      return this.compressImage(file);
    } else if (file.type.includes('video')) {
      return this.compressVideo(file);
    } else {
      console.log('不支持的文件类型');
      return null;
    }
  }

  static compressImage(imageFile) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // 假设将图片调整为宽度为 800 像素
          const targetWidth = 800;
          const targetHeight = (img.height / img.width) * targetWidth;

          canvas.width = targetWidth;
          canvas.height = targetHeight;

          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          canvas.toBlob((blob) => {
            const compressedImage = new File([blob], `compressed_${imageFile.name}`, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });

            // 假设压缩后的文件大小为原文件大小的一半
            compressedImage.customSize = imageFile.size / 2;

            console.log('图片压缩成功');
            resolve(compressedImage);
          }, 'image/jpeg', 0.2); // 压缩质量为 70%
        };
      };
    });
  }

  static compressVideo(videoFile) {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(videoFile);

      video.onloadedmetadata = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const targetWidth = 800;
        const targetHeight = (video.videoHeight / video.videoWidth) * targetWidth;

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const stream = canvas.captureStream();
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/webm; codecs=vp9',
        });

        const chunks = [];
        mediaRecorder.ondataavailable = (event) => {
          chunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const compressedVideo = new Blob(chunks, {
            type: 'video/webm',
          });

          const compressedVideoFile = new File([compressedVideo], `compressed_${videoFile.name}`, {
            type: 'video/webm',
            lastModified: Date.now(),
          });

          console.log(`压缩前大小：${videoFile.size} bytes`);
          console.log(`压缩后大小：${compressedVideoFile.size} bytes`);

          resolve(compressedVideoFile);
        };

        video.play();
        mediaRecorder.start();

        // 添加错误处理
        mediaRecorder.onerror = (e) => {
          reject(e);
        };

        setTimeout(() => {
          mediaRecorder.stop();
          video.pause();
          stream.getTracks().forEach((track) => {
            track.stop();
          });
        }, 5000);
      };

      video.onerror = (e) => {
        reject(e);
      };
    });
  }
}

export default Tools;
