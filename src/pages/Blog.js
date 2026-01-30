import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import "./Blog.css";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [authors, setAuthors] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState("");

  useEffect(() => {

    fetch(
      "https://front2.edukacija.online/backend/wp-json/wp/v2/categories")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      });

    fetch(
      "https://front2.edukacija.online/backend/wp-json/wp/v2/users?per_page=20")
      .then((response) => response.json())
      .then((data) => {
        setAuthors(data);
      } 
    )



    }, []);

  

  useEffect(() => {
    setLoading(true);

    let url = "https://front2.edukacija.online/backend/wp-json/wp/v2/posts?_embed";
    
    if(selectedCategory) url += "&categories=" + selectedCategory;
    if(selectedAuthor) url += "&author=" + selectedAuthor;


    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
      })
      .finally(() => setLoading(false));
  }, [selectedCategory, selectedAuthor]);

  return (
    <>
      {loading && <Loader />}
      <div className="blog-page">
        <div className="container">
          <h1>Blog</h1>

          <div className="row mb-4 mt-5">
              <div class="col-12">
                  {
                    categories.map((category) => (
                     <button 
                      key={category.id} 
                      onClick={() => setSelectedCategory(category.id)}>
                        {category.name}
                      </button>
                    ))}
              </div>

              <select className="form-select" onChange={
                (e) => setSelectedAuthor(e.target.value)
              }>
                <option value="">Svi autori</option>
                {
                  authors.map((author) => (
                    <option key={author.id} value={author.id}>{author.name}</option>
                  ))
                }
              </select>

          </div>

          <div className="row">
            {posts.map((post) => {
              const image =
                post._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes
                  ?.full?.source_url;

              return (
                <div key={post.id} className="col-md-4 mb-4 blog-post">
                  {image && (
                    <Link to={'/blog/' + post.slug}>
                    <img
                      src={image}
                      className="mb-3"
                      alt={post.title.rendered}
                    />
                    </Link>
                  )}

                  <Link to={'/blog/' + post.slug}>
                    <h2>{post.title.rendered}</h2>
                  </Link>
                  <div
                    dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                  />

                  <p>
                    {post._embedded?.author?.[0]?.name} |{" "}
                    {new Date(post.date).toLocaleDateString("hr-HR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;
