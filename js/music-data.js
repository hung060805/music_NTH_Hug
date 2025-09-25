// Dữ liệu bài hát - Dễ dàng thêm/sửa bài hát mới
const musicData = [
    {
        id: 1,
        title: "Em là",
        artist: "MONO",
        genre: "Mono",
        year: 2023,
        duration: "03:20",
        image: "https://photo-resize-zmp3.zmdcdn.me/w256_r1x1_jpeg/cover/e/e/9/a/ee9a369032f5f9ea3a02b3e69a344bce.jpg",
        audio: "audio/Mono/MONO - Em Là (Official Music Video).mp3"
    },
    {
        id: 2,
        title: "Hãy trao cho anh",
        artist: "Sơn Tùng M-TP",
        genre: "Sơn Tùng MTP",
        year: 2019,
        duration: "04:22",
        image: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2019/7/1/741911/Hay-Trao-Cho-Anh-3.jpg",
        audio: "audio/Son_Tung_MTP/SƠN TÙNG M-TP - HÃY TRAO CHO ANH ft. Snoop Dogg - Official MV.mp3"
    },
    {
        id: 3,
        title: "Đừng làm trái tim anh đau",
        artist: "Sơn Tùng M-TP",
        genre: "Sơn Tùng MTP",
        year: 2024,
        duration: "03:20",
        image: "https://i.ytimg.com/vi/7u4g483WTzw/maxresdefault.jpg",
        audio: "audio/Son_Tung_MTP/SƠN TÙNG M-TP - ĐỪNG LÀM TRÁI TIM ANH ĐAU - OFFICIAL MUSIC VIDEO.mp3"
    },
    {
        id: 4,
        title: "Chạy ngay đi",
        artist: "Sơn Tùng M-TP",
        genre: "Sơn Tùng MTP",
        year: 2018,
        duration: "02:47",
        image: "https://kenh14cdn.com/2018/5/12/ambi1033-1526059968586650474280-15260620507791657090486.jpg",
        audio: "audio/Son_Tung_MTP/CHẠY NGAY ĐI - RUN NOW - SƠN TÙNG M-TP - Official Music Video.mp3"
    },
    {
        id: 5,
        title: "Có Đôi Điều",
        artist: "Shiki",
        genre: "Lofi",
        year: 2020,
        duration: "03:06",
        image: "https://image-cdn.nct.vn/song/2024/06/25/4/4/7/1/1719254370918_300.jpg",
        audio: "audio/Lofi/Shiki - Có Đôi Điều ('Lặng' EP).mp3"
    },
    {
        id: 6,
        title: "Chăm Hoa",
        artist: "MONO",
        genre: "Mono",
        year: 2024,
        duration: "04:20",
        image: "https://bazaarvietnam.vn/wp-content/uploads/2024/10/bzvn-mono-cham-hoa-3-1.jpg",
        audio: "audio/Mono/MONO - 'Chăm Hoa' (Official Music Video).mp3"
    },
    {
        id: 7,
        title: "Ôm Em Thật Lâu",
        artist: "MONO",
        genre: "Mono",
        year: 2024,
        duration: "05:41",
        image: "https://photo-resize-zmp3.zmdcdn.me/w256_r1x1_jpeg/cover/e/8/1/4/e8143a89150f07d7356bc6e3fd6f5f62.jpg",
        audio: "audio/Mono/MONO - 'Ôm Em Thật Lâu' (Official Music Video).mp3"
    },
    {
        id: 8,
        title: "Em xinh",
        artist: "MONO",
        genre: "Mono",
        year: 2023,
        duration: "03:17",
        image: "https://i.ytimg.com/vi/MIWsUnAzv5c/maxresdefault.jpg",
        audio: "audio/Mono/MONO - Em Xinh (Official Music Video).mp3"
    },
    {
        id: 9,
        title: "Head In The Clouds",
        artist: "Hayd",
        genre: "US_UK",
        year: 2020,
        duration: "03:07",
        image: "https://i.ytimg.com/vi/-uFQzcY7YHc/maxresdefault.jpg",
        audio: "audio/Us_Uk/Hayd - Head In The Clouds (Official Video).mp3"
    },
    {
        id: 10,
        title: "Little Bit Better",
        artist: "Caleb Hearn & ROSIE",
        genre: "US_UK",
        year: 1965,
        duration: "03:47",
        image: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/25/56/64/255664d0-51ce-0469-6102-788e28cd0855/067003693462.png/1200x630bb.jpg",
        audio: "audio/Us_Uk/Caleb Hearn & ROSIE - Little Bit Better (Official Lyric Video).mp3"
    },
    {
        id: 11,
        title: "Heat Waves",
        artist: "Glass Animals",
        genre: "US_UK",
        year: 2020,
        duration: "03:55",
        image: "https://upload.wikimedia.org/wikipedia/en/b/b0/Glass_Animals_-_Heat_Waves.png",
        audio: "audio/Us_Uk/Glass Animals - Heat Waves (Official Video).mp3"
    },
    {
        id: 12,
        title: "Pano",
        artist: "Zack Tabudlo",
        genre: "US_UK",
        year: 2021,
        duration: "04:23",
        image: "https://i.scdn.co/image/ab67616d0000b2738c6111f0717dd3d85fdcbafd",
        audio: "audio/Us_Uk/Zack Tabudlo - Pano (Official Vietnamese Lyric Video).mp3"
    },
    {
        id: 13,
        title: "CHÚNG TA CỦA TƯƠNG LAI",
        artist: "SƠN TÙNG M-TP",
        genre: "Sơn Tùng MTP",
        year: 2024,
        duration: "04:36",
        image: "https://upload.wikimedia.org/wikipedia/vi/5/59/S%C6%A1n_T%C3%B9ng_M-TP_-_Ch%C3%BAng_ta_c%E1%BB%A7a_t%C6%B0%C6%A1ng_lai.png",
        audio: "audio/Son_Tung_MTP/SƠN TÙNG M-TP - CHÚNG TA CỦA TƯƠNG LAI - OFFICIAL MUSIC VIDEO.mp3"
    },
    {
        id: 14,
        title: "CÓ CHẮC YÊU LÀ ĐÂY",
        artist: "SƠN TÙNG M-TP",
        genre: "Sơn Tùng MTP",
        year: 2020,
        duration: "03:35",
        image: "https://cdn-images.vtv.vn/zoom/576_360/2020/7/1/10559857036784074121729353937215288623269034o-1593609923102895279634-crop-15936099318281441914204.jpg",
        audio: "audio/Son_Tung_MTP/SƠN TÙNG M-TP - CÓ CHẮC YÊU LÀ ĐÂY - OFFICIAL MUSIC VIDEO.mp3"
    },
    {
        id: 15,
        title: "MUỘN RỒI MÀ SAO CÒN",
        artist: "SƠN TÙNG M-TP",
        genre: "Sơn Tùng MTP",
        year: 2021,
        duration: "04:48",
        image: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/6/6/917562/178217789_4692543950.jpg",
        audio: "audio/Son_Tung_MTP/SƠN TÙNG M-TP - MUỘN RỒI MÀ SAO CÒN - OFFICIAL MUSIC VIDEO.mp3"
    },
    {
        id: 16,
        title: "Waiting For You",
        artist: "MONO",
        genre: "Mono",
        year: 2022,
        duration: "04:28",
        image: "https://i.ytimg.com/vi/CHw1b_1LVBA/maxresdefault.jpg",
        audio: "audio/Mono/MONO - Waiting For You (Official Music Video).mp3"
    },
    {
        id: 17,
        title: "CHẤM HẾT",
        artist: "ZEXZEX ft Dangrangto",
        genre: "Rap",
        year: 2023,
        duration: "03:14",
        image: "https://i1.sndcdn.com/artworks-MoO6WDaDa0D4DsRd-nGocyw-t500x500.jpg",
        audio: "audio/Rap/CHẤM HẾT - ZEXZEX ft Dangrangto (Prod. DONAL) I Official MV.mp3"
    },
    {
        id: 18,
        title: "MOIEM",
        artist: "Dangrangto",
        genre: "Rap",
        year: 2024,
        duration: "03:15",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxDCPB4BC9F8IpyhIzuMrE9R8DZCq_W8qRXA&s",
        audio: "audio/Rap/Dangrangto - MOIEM (Prod. DONAL) (Official Music Video).mp3"
    },
    {
        id: 19,
        title: "Giữ Lấy Làm Gì",
        artist: "MONSTAR",
        genre: "Rap",
        year: 2023,
        duration: "02:27",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLp2GiJ4Z8OJVapwO-n6ybqmeD3HB73HnJSzRs_dz9WfP4MdZPOMXOL3V3Vwjma2o3fg8&usqp=CAU",
        audio: "audio/Rap/Giữ Lấy Làm Gì - MONSTAR (prod. orizz) Drill - TIKTOK VER (Remake).mp3"
    },
    {
        id: 20,
        title: "Wrong Times",
        artist: "puppy & @Dangrangto",
        genre: "Rap",
        year: 2021,
        duration: "03:33",
        image: "https://i.scdn.co/image/ab67616d0000b27343076111d560c6aec19bac01",
        audio: "audio/Rap/puppy & @Dangrangto - Wrong Times ( ft. FOWLEX Snowz ) [OFFICIAL LYRICS VIDEO].mp3"
    },
    {
        id: 21,
        title: "một bài hát không vui mấy",
        artist: "T.R.I x @Dangrangto x DONAL",
        genre: "Rap",
        year: 2024,
        duration: "03:50",
        image: "https://i.ytimg.com/vi/EvPEeSBfB3E/sddefault.jpg?v=67694243",
        audio: "audio/Rap/T.R.I x @Dangrangto x DONAL - một bài hát không vui mấy (extended ver.) - OFFICIAL LYRICS VIDEO.mp3"
    },
    {
        id: 22,
        title: "TỪNG QUEN",
        artist: "WREN EVANS",
        genre: "Rap",
        year: 2022,
        duration: "02:54",
        image: "https://photo-resize-zmp3.zadn.vn/w600_r1x1_jpeg/cover/1/c/c/3/1cc3ed887dc8323c45821e013cde4ffa.jpg",
        audio: "audio/Rap/WREN EVANS - TỪNG QUEN - OFFICIAL AUDIO.mp3"
    },
    {
        id: 23,
        title: "KHÔNG BUÔNG",
        artist: "Hngle",
        genre: "Lofi",
        year: 2025,
        duration: "03:24",
        image: "https://photo-resize-zmp3.zadn.vn/w600_r1x1_jpeg/cover/b/7/b/1/b7b1a47096c2d8ac786da78c7fe6c987.jpg",
        audio: "audio/Lofi/Hngle - KHÔNG BUÔNG ft. Ari - Official Music Video.mp3"
    },
    {
        id: 24,
        title: "Anh Vui",
        artist: "Phạm Kỳ live",
        genre: "Lofi",
        year: 2023,
        duration: "03:30",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTH8qx08b-JlRGNizkpN8LCua0RFGE46FGLA&s",
        audio: "audio/Lofi/LIVE OUTDOOR - Phạm Kỳ live - Anh Vui - (Anh vui đến nỗi nghẹn ngào).mp3"
    },
    {
        id: 25,
        title: "Nắng Dưới Chân Mây",
        artist: "Nguyễn Hữu Kha",
        genre: "Lofi",
        year: 2025,
        duration: "04:13",
        image: "https://photo-resize-zmp3.zadn.vn/w360_r1x1_jpeg/cover/e/3/b/0/e3b09954a16e410cf10ac4e557454bb2.jpg",
        audio: "audio/Lofi/Nguyễn Hữu Kha - Nắng Dưới Chân Mây (Official Music Video).mp3"
    },
    {
        id: 26,
        title: "santa tell me",
        artist: "ariana grande",
        genre: "Noel",
        year: 2014,
        duration: "02:57",
        image: "https://xmasyuleblog.wordpress.com/wp-content/uploads/2019/12/ari1.jpg",
        audio: "audio/Noel/ariana grande - santa tell me (sped up & reverb).mp3"
    },
    {
        id: 27,
        title: "SÀI GÒN ĐÂU CÓ LẠNH",
        artist: "Changg x LeWiuy",
        genre: "Noel",
        year: 2022,
        duration: "02:44",
        image: "https://i.ytimg.com/vi/UviiOKPlg8s/maxresdefault.jpg",
        audio: "audio/Noel/Changg x LeWiuy - SÀI GÒN ĐÂU CÓ LẠNH - Official Lyric Video.mp3"
    },
    {
        id: 28,
        title: "chẳng giống giáng sinh",
        artist: "Lu ft. Willistic & datfitzx",
        genre: "Noel",
        year: 2021,
        duration: "03:16",
        image: "https://photo-resize-zmp3.zadn.vn/w600_r1x1_jpeg/cover/1/a/4/b/1a4b6c9ab56f94772bf479da3ab02d58.jpg",
        audio: "audio/Noel/chẳng giống giáng sinh - Lu ft. Willistic & datfitzx (Official Visualizer).mp3"
    },
    {
        id: 29,
        title: "Last Christmas",
        artist: "George Michael & Wham - Beth Acoustic Piano Cover",
        genre: "Noel",
        year: 1984,
        duration: "04:00",
        image: "https://i.ytimg.com/vi/7A1IJqGgaAY/mqdefault.jpg",
        audio: "audio/Noel/Last Christmas - George Michael & Wham - Beth Acoustic Piano Cover (Lyrics & Vietsub).mp3"
    }


];

// Danh sách thể loại
const genres = ['Lofi', 'Noel', 'US_UK', 'Rap', 'Sơn Tùng MTP', 'Mono'];

// Hàm lấy bài hát theo thể loại
function getSongsByGenre(genre) {
    return musicData.filter(song => song.genre === genre);
}

// Hàm tìm kiếm bài hát
function searchSongs(query) {
    const searchTerm = query.toLowerCase();
    return musicData.filter(song => 
        song.title.toLowerCase().includes(searchTerm) ||
        song.artist.toLowerCase().includes(searchTerm) ||
        song.genre.toLowerCase().includes(searchTerm)
    );
}

// Hàm lấy bài hát theo ID
function getSongById(id) {
    return musicData.find(song => song.id === parseInt(id));
}

// Export để sử dụng trong các file khác
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { musicData, genres, getSongsByGenre, searchSongs, getSongById };
}



