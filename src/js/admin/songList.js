{
  let view = {
    el: '.songList',
    template: `
      <div class="tableContainer">
      <table>
        <thead>
          <tr>
            <th class="name">歌名</th>
            <th class="singer">歌手</th>
            <th class="createTime">创建时间</th>
            <th class="updateTime">更新时间</th>
            <th class="actions">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="name">天后天后天后天</td>
            <td class="singer">陈势安陈</td>
            <td class="createTime">2018/12/5 下午10:57:23</td>
            <td class="updateTime">2018/12/5 下午10:57:23</td>
            <td>
              <span class="far fa-edit edit"></span>
              <span class="far fa-trash-alt delete"></span>
            </td>
          </tr>
        </tbody>
      </table>
      </div>
    `,
    render(data) {
      $(this.el).html(this.template)
      let { songs } = data
      // let songs1 = songs.reverse()
      let trList = songs.map((song) => {
        return ` <tr data-songId = ${song.id}><td class="name">${song.name}</td><td class="singer">${song.singer}</td>
        <td class="createTime">${song.createTime}</td><td class="updateTime">${song.updateTime}</td><td>
        <span class="far fa-edit edit"></span>
        <span class="far fa-trash-alt delete"></span>
        </td></tr>`
      })
      $(this.el).find('tbody').empty()
      trList.map((trDom) => {
        $(this.el).find('tbody').append(trDom)
      })
    },
    hideSongList() {
      $(this.el).css('display', 'none')
    },
    showSongList() {
      $(this.el).css('display', 'block')
    }
  }

  let model = {
    data: {
      songs: []
    },
    find() {
      let query = new AV.Query('Song')
      query.descending('updatedAt')
      // query.ascending('createdAt')
      return query.find().then((songs) => {
        this.data.songs = songs.map((song) => {
          let songs = { id: song.id, ...song.attributes }
          let createDate = song.createdAt.toLocaleDateString()
          let createHours = time(song.createdAt.getHours())
          let createMinutes = time(song.createdAt.getMinutes())
          let createSeconds = time(song.createdAt.getSeconds())

          let updateDate = song.updatedAt.toLocaleDateString()
          let updateHours = time(song.updatedAt.getHours())
          let updateMinutes = time(song.updatedAt.getMinutes())
          let updateSeconds = time(song.updatedAt.getSeconds())
          function time(time) {
            if (time < 10) {
              time = '0' + time
            }
            return time
          }
          let createTime = createDate + ' ' + createHours + ':' + createMinutes + ':' + createSeconds
          let updateTime = updateDate + ' ' + updateHours + ':' + updateMinutes + ':' + updateSeconds
          songs.createTime = createTime
          songs.updateTime = updateTime
          return songs
        })
        return songs
      })
    },
    delete(data) {
      let song = AV.Object.createWithoutData('Song', data.id)
      return song.destroy().then((xxx) => {
      })
    }
  }

  let controller = {
    init(view, model) {
      this.model = model
      this.view = view
      this.view.render(this.model.data)
      this.bindEvents()
      this.model.find().then((data) => {
        this.view.render(this.model.data)
      })
      this.bindEventHub()
    },
    bindEvents() {
      $(this.view.el).on('click', '.edit', (e) => {
        e.preventDefault()
        let $e = $(e.currentTarget)
        let songId = $e.parent().parent().attr('data-songId')
        let data
        let songs = this.model.data.songs
        for (let i = 0; i < songs.length; i++) {
          if (songs[i].id === songId) {
            data = songs[i]
            break
          }
        }
        window.eventHub.emit('edit', JSON.parse(JSON.stringify(data)))
      })
      $(this.view.el).on('click', '.delete', (e) => {
        let $e = $(e.currentTarget)
        let songId = $e.parent().parent().attr('data-songId')
        let data
        let songs = this.model.data.songs
        for (let i = 0; i < songs.length; i++) {
          if (songs[i].id === songId) {
            data = songs[i]
            break
          }
        }
        window.eventHub.emit('delete', JSON.parse(JSON.stringify(data)))
      })
    },
    bindEventHub() {
      window.eventHub.on('upload', (data) => {
        this.view.hideSongList()
      })

      window.eventHub.on('cancel', (data) => {
        this.view.showSongList()
      })

      window.eventHub.on('create', (data) => {
        this.view.showSongList()
        this.model.data.songs.unshift(data)
        this.view.render(this.model.data)
      })
      window.eventHub.on('update', (data) => {
        this.view.showSongList()
        let songs = this.model.data.songs
        for (let i = 0; i < songs.length; i++) {
          if (songs[i].id === data.id) {
            songs[i] = data
          }
        }
        this.view.render(this.model.data)
      })
      window.eventHub.on('edit', (data) => {
        this.view.hideSongList()
      })
      window.eventHub.on('delete', (data) => {
        this.view.hideSongList()
      })
      window.eventHub.on('deleteCancel', () => {
        this.view.showSongList()
      })
      window.eventHub.on('deleteSong', (song) => {
        this.view.showSongList()
        this.model.delete(song).then((data) => {
          this.model.find().then((data) => {
            this.view.render(this.model.data)
          })
        })
      })
    }
  }

  controller.init(view, model)
}