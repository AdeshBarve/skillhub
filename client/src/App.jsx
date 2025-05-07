import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    skills: "",
    bio: "",
    github: "",
    linkedin: ""
  });

  useEffect(() => {
    axios.get("/api/users").then(res => setUsers(res.data));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = { ...formData, skills: formData.skills.split(",") };
    const res = await axios.post("/api/users", newUser);
    setUsers([...users, res.data]);
    setFormData({ name: "", email: "", skills: "", bio: "", github: "", linkedin: "" });
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/users/${id}`);
    setUsers(users.filter(u => u._id !== id));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>SkillHub - Student Skill Showcase</h1>

      <form onSubmit={handleSubmit}>
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
        <input name="skills" value={formData.skills} onChange={handleChange} placeholder="Skills (comma separated)" />
        <input name="bio" value={formData.bio} onChange={handleChange} placeholder="Bio" />
        <input name="github" value={formData.github} onChange={handleChange} placeholder="GitHub URL" />
        <input name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="LinkedIn URL" />
        <button type="submit">Add User</button>
      </form>

      <ul>
        {users.map(u => (
          <li key={u._id}>
            <strong>{u.name}</strong> - {u.skills.join(", ")} - <a href={u.github}>GitHub</a>
            <button onClick={() => handleDelete(u._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
