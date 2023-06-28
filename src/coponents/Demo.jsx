import React, { useState, useEffect } from "react"
import { copy, linkIcon, loader, tick } from "../assets"

import { useLazyGetSummaryQuery } from "../services/article"

const Demo = () => {
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  })
  const [allArticles, setAllArticles] = useState([])

  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery()

  // 初次加载时, 从 localstorage 中获取文章摘要历史记录
  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(localStorage.getItem('articles'))

    if(articlesFromLocalStorage){
      setAllArticles(articlesFromLocalStorage)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const existingArticle = allArticles.find(
      item => item.url === article.url
    )
    if(existingArticle) return setArticle(existingArticle)

    const { data } = await getSummary({
      articleUrl: article.url,
    })
    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary }
      const updatedAllArticles = [newArticle, ...allArticles]

      console.log(newArticle)
      // 更新 state 和localstorage
      setArticle(newArticle)
      setAllArticles(updatedAllArticles)
      localStorage.setItem('articles', JSON.stringify(updatedAllArticles))
    }
  }


  return (
    <section className="mt-16 w-full max-w-xl">
      {/* 搜索 */}
      <div className="flex flex-col w-full gap-2">
        <form
          className="relative flex justify-center items-center"
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt="link-icon"
            className="absolute left-0 my-2 ml-3 w-5"
          />

          <input
            type="url"
            placeholder="请粘贴文章链接"
            value={article.url}
            onChange={(e) =>
              setArticle({
                ...article,
                url: e.target.value,
              })
            }
            required
            className="url_input peer"
          />
          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
          >
            <p>↵</p>
          </button>
        </form>
        {/* todo 浏览历史 */}
      </div>

      {/* 展示摘要结果 */}
    </section>
  )
}

export default Demo
