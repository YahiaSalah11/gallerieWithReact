import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const paintings = [
  { 
    id: 1, 
    title: 'The Kiss', 
    description: `“The Kiss”, probably the most popular work by Gustav Klimt, was first exhibited in 1908 at the Kunstschau art exhibition on the site of today’s Konzerthaus. The Ministry bought it from there for the sum of 25,000 Kronen and thus secured for the state one of the icons of Viennese Jugendstil and indeed of European modern art. It undoubtedly represents the culmination of the phase known as the “Golden Epoch”. In this decade, the artist created a puzzling, ornamental encoded programme that revolved around the mystery of existence, love and fulfilment through art. Klimt gained initial inspiration for this in 1903 on a journey to Ravenna to see the Byzantine mosaics. In addition, the painting contains a myriad of motifs from various cultural epochs, above all from Ancient Egyptian mythology. Most recent research has, however, revealed that it is not enough to read the ornaments in the picture just as symbols rooted in tradition aiming to convey a timelessly valid message. They reveal more, such as references to Klimt’s love for Emilie Flöge and the artist’s exploration of the sculptor Auguste Rodin’s art.`, 
    image: 'https://www.gustav-klimt.com/assets/img/paintings/The-Kiss.jpg' 
  },
  { 
    id: 2, 
    title: 'Impression Sunrise', 
    description: 'This famous painting, Impression, Sunrise, was created from a scene in the port of Le Havre. Monet depicts a mist, which provides a hazy background to the piece set in the French harbor. The orange and yellow hues contrast brilliantly with the dark vessels, where little, if any detail is immediately visible to the audience. It is a striking and candid work that shows the smaller boats in the foreground almost being propelled along by the movement of the water. This has, once again, been achieved by separate brushstrokes that also show various colors "sparkling" on the sea. From the 15th April to 15th May 1874 Monet exhibited his work together with Camille Pissarro, Alfred Sisley, Edouard Manet, Paul Cezanne, Edgar Degas, and some other thirty artists. They organized their exhibition on their own as they were usually rejected at the Paris Salon. Most visitors were disgusted and even outraged over such a graffiti. Monets Impression, Sunrise enjoyed the most attention and some visitors even claimed that they were absolutely unable to recognize what was shown at all.', 
    image: 'https://www.claude-monet.com/assets/img/paintings/impression-sunrise.jpg' 
  },
  { 
    id: 3, 
    title: 'Claude Monet', 
    description: 'Oscar-Claude Monet was a French painter and founder of Impressionism painting who is seen as a key precursor to modernism, especially in his attempts to paint nature as he perceived it.[1] During his long career, he was the most consistent and prolific practitioner of Impressionisms philosophy of expressing ones perceptions of nature, especially as applied to plein air (outdoor) landscape painting.[2] The term "Impressionism" is derived from the title of his painting Impression, soleil levant, which was first exhibited in the so-called "exhibition of rejects" of 1874–an exhibition initiated by Monet and like-minded artists as an alternative to the Salon. Monet was raised in Le Havre, Normandy, and became interested in the outdoors and drawing from an early age. Although his mother, Louise-Justine Aubrée Monet, supported his ambitions to be a painter, his father, Claude-Adolphe, disapproved and wanted him to pursue a career in business. He was very close to his mother, but she died in January 1857 when he was sixteen years old, and he was sent to live with his childless, widowed but wealthy aunt, Marie-Jeanne Lecadre. He went on to study at the Académie Suisse, and under the academic history painter Charles Gleyre, where he was a classmate of Auguste Renoir. His early works include landscapes, seascapes, and portraits, but attracted little attention. A key early influence was Eugène Boudin, who introduced him to the concept of plein air painting. From 1883, Monet lived in Giverny, also in northern France, where he purchased a house and property and began a vast landscaping project, including a water-lily pond.', 
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Claude_Monet_1899_Nadar_crop.jpg/800px-Claude_Monet_1899_Nadar_crop.jpg' 
  }
];

const HelloPage = ({ loggedIn, user, setLoggedIn, setUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/check-session', { withCredentials: true })
      .then((response) => {
        if (response.data.loggedIn) {
          setUser(response.data.user);
        }
      })
      .catch((err) => console.error(err));
  }, [setUser]);

  const handleLogout = async () => { 
    try {
      await axios.post('http://localhost:5000/api/logout', {}, { withCredentials: true });
      setUser(null);
      setLoggedIn(false);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <div>
      {/* ✅ شريط التنقل الثابت */}
      <div style={{ 
        position: 'fixed', top: 0, left: 0, width: '100%', 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '10px 20px', background: '#333', color: 'white', zIndex: 1000 
      }}>
        <h2>Art Gallery</h2>
        <div>
          {loggedIn && user ? (
            <div style={{ marginRight: '30px' }}>
              <span style={{ marginRight: '10px' }}>Welcome, {user.username}</span>
              <button onClick={handleLogout} style={{ padding: '5px 10px' }}>Logout</button>
            </div>
          ) : (
            <div style={{ marginRight: '30px' }}>
              <button onClick={() => navigate('/login')} style={{ marginRight: '10px', padding: '5px 10px' }}>Login</button>
              <button onClick={() => navigate('/signup')} style={{ padding: '5px 10px' }}>Sign Up</button>
            </div>
          )}
        </div>
      </div>

      {/* ✅ ضبط المسافة تحت الـ Navbar */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' , height: '700px'}}>
        {paintings.map((painting) => (
          <div key={painting.id} style={{ width: '40%', marginBottom: '20px', textAlign: 'center' }}>
            <img src={painting.image} alt={painting.title} style={{ width: '100%', height: 'auto', borderRadius: '10px' }} />
            <h3>{painting.title}</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'left' }}>
              <p style={{ width: '48%' }}>{painting.description.split('.').slice(0, Math.ceil(painting.description.split('.').length / 2)).join('.')}.</p>
              <p style={{ width: '48%' }}>{painting.description.split('.').slice(Math.ceil(painting.description.split('.').length / 2)).join('.')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelloPage;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const paintings = [
//   { 
//     id: 1, 
//     title: 'The Kiss', 
//     description: `“The Kiss”, probably the most popular work by Gustav Klimt, was first exhibited in 1908 at the Kunstschau art exhibition on the site of today’s Konzerthaus. The Ministry bought it for the sum of 25,000 Kronen and thus secured for the state one of the icons of Viennese Jugendstil and indeed of European modern art. 
//     It undoubtedly represents the culmination of the phase known as the “Golden Epoch”.`, 
//     image: 'https://www.gustav-klimt.com/assets/img/paintings/The-Kiss.jpg' 
//   },
//   { 
//     id: 2, 
//     title: 'Impression Sunrise', 
//     description: 'This famous painting, Impression, Sunrise, was created from a scene in the port of Le Havre. Monet depicts a mist, which provides a hazy background to the piece set in the French harbor. The orange and yellow hues contrast brilliantly with the dark vessels, where little, if any detail is immediately visible to the audience. It is a striking and candid work that shows the smaller boats in the foreground almost being propelled along by the movement of the water. This has, once again, been achieved by separate brushstrokes that also show various colors "sparkling" on the sea. From the 15th April to 15th May 1874 Monet exhibited his work together with Camille Pissarro, Alfred Sisley, Edouard Manet, Paul Cezanne, Edgar Degas, and some other thirty artists. They organized their exhibition on their own as they were usually rejected at the Paris Salon. Most visitors were disgusted and even outraged over such a graffiti. Monets Impression, Sunrise enjoyed the most attention and some visitors even claimed that they were absolutely unable to recognize what was shown at all.', 
//     image: 'https://www.claude-monet.com/assets/img/paintings/impression-sunrise.jpg' 
//   },
//   { 
//     id: 3, 
//     title: 'Claude Monet', 
//     description: 'Oscar-Claude Monet was a French painter and founder of Impressionism painting who is seen as a key precursor to modernism, especially in his attempts to paint nature as he perceived it.[1] During his long career, he was the most consistent and prolific practitioner of Impressionisms philosophy of expressing ones perceptions of nature, especially as applied to plein air (outdoor) landscape painting.[2] The term "Impressionism" is derived from the title of his painting Impression, soleil levant, which was first exhibited in the so-called "exhibition of rejects" of 1874–an exhibition initiated by Monet and like-minded artists as an alternative to the Salon. Monet was raised in Le Havre, Normandy, and became interested in the outdoors and drawing from an early age. Although his mother, Louise-Justine Aubrée Monet, supported his ambitions to be a painter, his father, Claude-Adolphe, disapproved and wanted him to pursue a career in business. He was very close to his mother, but she died in January 1857 when he was sixteen years old, and he was sent to live with his childless, widowed but wealthy aunt, Marie-Jeanne Lecadre. He went on to study at the Académie Suisse, and under the academic history painter Charles Gleyre, where he was a classmate of Auguste Renoir. His early works include landscapes, seascapes, and portraits, but attracted little attention. A key early influence was Eugène Boudin, who introduced him to the concept of plein air painting. From 1883, Monet lived in Giverny, also in northern France, where he purchased a house and property and began a vast landscaping project, including a water-lily pond.', 
//     image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Claude_Monet_1899_Nadar_crop.jpg/800px-Claude_Monet_1899_Nadar_crop.jpg' 
//   }
// ];

// const HelloPage = ({ loggedIn, user, setLoggedIn, setUser }) => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios.get('http://localhost:5000/api/check-session', { withCredentials: true })
//       .then((response) => {
//         if (response.data.loggedIn) {
//           setUser(response.data.user);
//         }
//       })
//       .catch((err) => console.error(err));
//   }, [setUser]);

//   const handleLogout = async () => { 
//     try {
//       await axios.post('http://localhost:5000/api/logout', {}, { withCredentials: true });
//       setUser(null);
//       setLoggedIn(false);
//       navigate('/login');
//     } catch (err) {
//       console.error('Logout failed', err);
//     }
//   };

//   return (
//     <div>
//       {/* Navigation Bar */}
//       <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#333', color: 'white' }}>
//         <h2 style={{marginTop: '60px'}}>Art Gallery</h2>
//         <div style={{marginTop: '50px'}}>
//           {loggedIn && user ? (
//             <>
//               <span style={{ marginRight: '10px' }}>Welcome, {user.username}</span>
//               <button onClick={handleLogout} style={{ padding: '5px 10px' }}>Logout</button>
//             </>
//           ) : (
//             <>
//               <button onClick={() => navigate('/login')} style={{ marginRight: '10px', padding: '5px 10px' }}>Login</button>
//               <button onClick={() => navigate('/signup')} style={{ padding: '5px 10px' }}>Sign Up</button>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Paintings Display */}
      // <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' ,}}>
      //   {paintings.map((painting) => (
      //     <div key={painting.id} style={{ width: '20%', marginBottom: '20px', textAlign: 'center' }}>
      //       <img src={painting.image} alt={painting.title} style={{ width: '100%', height: 'auto', borderRadius: '10px' }} />
      //       <h3>{painting.title}</h3>
      //       <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'left' }}>
      //         <p style={{ width: '48%' }}>{painting.description.split('.').slice(0, Math.ceil(painting.description.split('.').length / 2)).join('.')}.</p>
      //         <p style={{ width: '48%' }}>{painting.description.split('.').slice(Math.ceil(painting.description.split('.').length / 2)).join('.')}</p>
      //       </div>
      //     </div>
      //   ))}
      // </div>
//     </div>
//   );
// };

// export default HelloPage;
