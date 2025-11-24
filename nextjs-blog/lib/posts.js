// import fs from 'fs';
// import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import got from 'got'; // Install with: npm install got@9.6.0



// WordPress REST API endpoint
const dataURL = "https://dev-srjc-fall-2025-cs55-13.pantheonsite.io/wp-json/wp/v2/car";


export async function getSortedPostsData() {
   // const filePath = path.join(dataDir, 'posts.json');
  // const jsonString = fs.readFileSync(filePath, 'utf8');
  try {
    //  JSON data from WordPress
    const jsonString = await got(dataURL);
    const posts = JSON.parse(jsonString.body);
    console.log(posts);
    // Sort posts by date descending
    const sortedPosts = posts.sort((a, b) => (a.title.rendered < b.title.rendered ? 1 : -1));
    

    // Return array of objects
    return sortedPosts.map(post => ({
      id: post.ID.toString(),
      title: post.title.rendered,
      
    }));
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getAllPostIds() {
  try {
    const jsonString = await got(dataURL);
    const posts = JSON.parse(jsonString.body);

    return posts.map(post => ({
      params: {
        id: post.ID.toString(),
        name: post.title.rendered,
      },
    }));
  } catch (error) {
    console.log( error);
    return [];
  }
}


export async function getPostData(id) {
  const singlePostURL = `https://dev-srjc-fall-2025-cs55-13.pantheonsite.io/wp-json/wp/v2/posts/${id}`;

  try {
    const jsonString = await got(singlePostURL);
    const post = JSON.parse(jsonString.body);

    // Convert post content (HTML) into processed HTML string
    const processedContent = await remark().use(html).process(post.content.rendered);
    const contentHtml = processedContent.toString();

    return {
      id: post.id.toString(),
      title: post.title.rendered,
      
    };
  } catch (error) {
    console.log(error);
    return { id, title: "Post Not Found" };
  }
}
