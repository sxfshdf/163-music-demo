{
  let view = {
    el: '.songList',
    template: `
    <p class="listName">歌曲列表</p>
      <ul class="songs">
      </ul>
      <div class="tip"> 已经到最后一首啦 </div>
    `,
    render(data){
      $(this.el).html(this.template)
      let {songs} = data
      let n = 0
      songs.map((song)=>{
        n+=1
        let $li = $(`
          <li class="song">
            <p class="order">${(n<10)?'0'+n:n}</p>
            <a href="./song.html?id=${song.id}">
              <div class="songInfo">
                <p class="songName">${song.name}</p>
                <p class="singer">${song.singer}</p>
              </div>
              <div class="playIcon">
                <i class="fas fa-play play"></i>
              </div>
            </a>
          </li>
        `)
        $(this.el).find('ul.songs').append($li)
      })
    }
  }

  let model = {
    data: {
      songs: []
    },
    find(data) {
      let playlist = AV.Object.createWithoutData('Playlist', data.id)
      let query = new AV.Query('PlaylistMap')
      query.equalTo('playlist', playlist)
      query.include('song')
      query.descending('createdAt')
      return query.find().then((playlistMap) => {
        let songs = playlistMap.map((xxx) => {
          return xxx.get('song')
        })
        this.data.songs = songs.map((song) => {
          let songs = { id: song.id, ...song.attributes }
          return songs
        })
        return songs
      })
    }
  }

  let controller = {
    init(view,model){
      this.model = model
      this.view = view
      this.getListId()
      this.model.find(this.model.data).then(()=>{
        this.view.render(this.model.data)
      })
    },
    getListId(){
      let search = window.location.search
      if(search.indexOf('?')==0){
        search = search.substring(1)
      }
      let array = search.split('&').filter((v => v))
      let id 
      for(let i=0; i<array.length; i++){
        let hash = array[i].split('=')
        if(hash[0] === 'id'){
          id = hash[1]
        }
      }
      this.model.data.id = id
    }
  }

  controller.init(view,model)
}