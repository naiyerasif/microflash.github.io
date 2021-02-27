const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

const { writeToFile } = require('./app.server')
const { prefs, paths } = require('./app.config')
const projects = require('./content/projects')

const reportPath = `${paths.report.dir}/${paths.report.name}`
const popularPosts = require(reportPath)

const outdationDate = dayjs().clone().subtract(prefs.outdationPeriod, 'days').startOf('day')

module.exports = api => {

  api.onCreateNode(options => {
    if (options.internal.typeName === 'Blog') {
      if (!options.category) {
        options.category = 'guide'
      }

      if (typeof(options.status) == 'undefined') {
        options.status = outdationDate && dayjs(options.date).isBefore(outdationDate) ? 'outdated' : 'fresh'
      }
    }
    
    return { ...options }
  })

  api.loadSource(async ({ addCollection }) => {
    const allProjects = addCollection({
      typeName: 'Project'
    })
    projects.forEach(project => {
      allProjects.addNode({
        title: project.title,
        description: project.description,
        link: project.path
      })
    })

    const popularBlogPosts = addCollection({
      typeName: 'PopularBlog'
    })
    popularPosts.forEach(entry => popularBlogPosts.addNode(entry))
  })

  api.createPages(async ({ graphql, createPage }) => {
    const { data } = await graphql(`{
      allBlog {
        edges {
          node {
            id
            path
          }
          next {
            id
          }
          previous {
            id
          }
        }
      }
    }`)

    data.allBlog.edges.forEach(element => {
      createPage({
        path: element.node.path,
        component: './src/templates/Post.vue',
        context: {
          previousId: (element.previous) ? element.previous.id : '#',
          nextId: (element.next) ? element.next.id : '#',
          id: element.node.id
        }
      })
    })
  })

  api.beforeBuild(context => {
    const collection = context._app.store.getCollection('Blog')._collection

    const posts = collection.data.map(post => {
      return {
        title: post.title,
        path: post.path,
        topics: post.topics
      }
    })

    writeToFile('search index', paths.search, posts)
  })
}
