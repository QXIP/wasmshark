if (!self.crossOriginIsolated) {
  // message.innerHTML = 'COOP/COEP Error! Execution blocked.';
  console.log("COOP/COEP Error! Execution blocked.");
} else {
  // message.innerHTML = 'Ready!';
  console.log("ffmpeg::Ready!");
}

const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({
  log: false,
  corePath: "./ffmpeg/ffmpeg-core.js",
  progress: ({ ratio }) => {
    message.innerHTML = `Complete: ${(ratio * 100.0).toFixed(2)}%`;
  },
});

const defaults = {
	"bin":    "ffmpeg",
	"global": "-hide_banner",

	// inputs
	"file": "-re -i {input}",
	"http": "-fflags nobuffer -flags low_delay -i {input}",
	"rtsp": "-fflags nobuffer -flags low_delay -timeout 5000000 -user_agent go2rtc/ffmpeg -rtsp_flags prefer_tcp -i {input}",

	"rtsp/udp": "-fflags nobuffer -flags low_delay -timeout 5000000 -user_agent go2rtc/ffmpeg -i {input}",

	// output
	"output":       "-user_agent ffmpeg/go2rtc -rtsp_transport tcp -f rtsp {output}",
	"output/mjpeg": "-f mjpeg -",

	// `-preset superfast` - we can't use ultrafast because it doesn't support `-profile main -level 4.1`
	// `-tune zerolatency` - for minimal latency
	// `-profile high -level 4.1` - most used streaming profile
	// `-pix_fmt:v yuv420p` - important for Telegram
	"h264":  "-c:v libx264 -g 50 -profile:v high -level:v 4.1 -preset:v superfast -tune:v zerolatency -pix_fmt:v yuv420p",
	"h265":  "-c:v libx265 -g 50 -profile:v main -level:v 5.1 -preset:v superfast -tune:v zerolatency",
	"mjpeg": "-c:v mjpeg",
	//"mjpeg": "-c:v mjpeg -force_duplicated_matrix:v 1 -huffman:v 0 -pix_fmt:v yuvj420p",

	// https://ffmpeg.org/ffmpeg-codecs.html#libopus-1
	// https://github.com/pion/webrtc/issues/1514
	// https://ffmpeg.org/ffmpeg-resampler.html
	// `-async 1` or `-min_comp 0` - force frame_size=960, important for WebRTC audio quality
	"opus":       "-c:a libopus -application:a lowdelay -frame_duration 20 -min_comp 0",
	"pcmu":       "-c:a pcm_mulaw -ar:a 8000 -ac:a 1",
	"pcmu/16000": "-c:a pcm_mulaw -ar:a 16000 -ac:a 1",
	"pcmu/48000": "-c:a pcm_mulaw -ar:a 48000 -ac:a 1",
	"pcma":       "-c:a pcm_alaw -ar:a 8000 -ac:a 1",
	"pcma/16000": "-c:a pcm_alaw -ar:a 16000 -ac:a 1",
	"pcma/48000": "-c:a pcm_alaw -ar:a 48000 -ac:a 1",
	"aac":        "-c:a aac", // keep sample rate and channels
	"aac/16000":  "-c:a aac -ar:a 16000 -ac:a 1",
	"mp3":        "-c:a libmp3lame -q:a 8",
	"pcm":        "-c:a pcm_s16be -ar:a 8000 -ac:a 1",
	"pcm/16000":  "-c:a pcm_s16be -ar:a 16000 -ac:a 1",
	"pcm/48000":  "-c:a pcm_s16be -ar:a 48000 -ac:a 1",
	"pcml":       "-c:a pcm_s16le -ar:a 8000 -ac:a 1",
	"pcml/44100": "-c:a pcm_s16le -ar:a 44100 -ac:a 1",

	// hardware Intel and AMD on Linux
	// better not to set `-async_depth:v 1` like for QSV, because framedrops
	// `-bf 0` - disable B-frames is very important
	"h264/vaapi":  "-c:v h264_vaapi -g 50 -bf 0 -profile:v high -level:v 4.1 -sei:v 0",
	"h265/vaapi":  "-c:v hevc_vaapi -g 50 -bf 0 -profile:v high -level:v 5.1 -sei:v 0",
	"mjpeg/vaapi": "-c:v mjpeg_vaapi",

	// hardware Raspberry
	"h264/v4l2m2m": "-c:v h264_v4l2m2m -g 50 -bf 0",
	"h265/v4l2m2m": "-c:v hevc_v4l2m2m -g 50 -bf 0",

	// hardware NVidia on Linux and Windows
	// preset=p2 - faster, tune=ll - low latency
	"h264/cuda": "-c:v h264_nvenc -g 50 -bf 0 -profile:v high -level:v auto -preset:v p2 -tune:v ll",
	"h265/cuda": "-c:v hevc_nvenc -g 50 -bf 0 -profile:v high -level:v auto",

	// hardware Intel on Windows
	"h264/dxva2":  "-c:v h264_qsv -g 50 -bf 0 -profile:v high -level:v 4.1 -async_depth:v 1",
	"h265/dxva2":  "-c:v hevc_qsv -g 50 -bf 0 -profile:v high -level:v 5.1 -async_depth:v 1",
	"mjpeg/dxva2": "-c:v mjpeg_qsv -profile:v high -level:v 5.1",

	// hardware macOS
	"h264/videotoolbox": "-c:v h264_videotoolbox -g 50 -bf 0 -profile:v high -level:v 4.1",
	"h265/videotoolbox": "-c:v hevc_videotoolbox -g 50 -bf 0 -profile:v high -level:v 5.1",
}


const transcode = async (blobData, codec, output) => {
  try {
    // console.log("Loading ffmpeg-core.js");

    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }

    console.log("Start transcoding");
    // await ffmpeg.FS('writeFile', name, files[0]);
    ffmpeg.FS("writeFile", "segment.pcap", await fetchFile(blobData));

    // var output = "output.mp3" ;
    //var cmd = ['-i', name, '-f', codec.value, '-ar', 8000, output]
    // await ffmpeg.run("-err_detect", "ignore_err", "-i", "segment.pcap", output);

    /**
     * ffmpeg -f g722 -i call1.rtp -id3v2_version 3 call4.mp3
     */

    const command = [
      "-f", codec || "g722",
    ];
    if(codec != "g722") {
      command.push("-ar", "8000")
    }
    command.push(
      "-i",
      "segment.pcap",
      "-id3v2_version",
      "3",
      output,
    );

    const ffmpeg_data = await ffmpeg.run(...command);

    // console.log(ffmpeg_data);
    // await ffmpeg.run(
    //   "-f",
    //   "g722",
    //   "-i",
    //   "segment.pcap",
    //   "-acodec",
    //   "pcm_s16le",
    //   "-ar",
    //   "16000",
    //   "-ac",
    //   "1",
    //   output
    // );
    console.log("Complete transcoding");
    const data = ffmpeg.FS("readFile", output);
    return URL.createObjectURL(new Blob([data.buffer], { type: "audio/mpeg" }));
  } catch (e) {
    console.log(e);
  }
};
