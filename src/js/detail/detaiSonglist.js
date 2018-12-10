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
            <a href="">
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
    find() {
      let query = new AV.Query('Song')
      query.descending('updatedAt')
      return query.find().then((songs) => {
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
      this.model.find().then(()=>{
        this.view.render(this.model.data)
      })
    }
  }

  controller.init(view,model)
}