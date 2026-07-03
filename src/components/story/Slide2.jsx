// Slide 2: Emma checking her purse — "Do I have enough money?"
import React from 'react';

export function Slide2() {
  return (
    <div style={{
      width:'100%', height:'100%', position:'relative', overflow:'hidden',
      background:'linear-gradient(180deg,#f5e6c8 0%,#e8d4a8 100%)',
      display:'flex', flexDirection:'column',
    }}>
      {/* Top row: Emma + thought bubble + shop shelves */}
      <div style={{ flex:1, display:'flex', gap:0, minHeight:0 }}>

        {/* Left background shelves */}
        <div style={{
          position:'absolute', right:0, top:0, bottom:0, width:'45%',
          background:'linear-gradient(180deg,#f0e0c0,#d4b483)',
          display:'flex', flexDirection:'column', gap:8, padding:10,
          justifyContent:'center',
        }}>
          {/* Shelves */}
          {[
            [{ emoji:'🧃', price:'60¢' },{ emoji:'🧃', price:'60¢' }],
            [{ emoji:'🍟', price:'$1.00' },{ emoji:'🍟', price:'$1.00' }],
            [{ emoji:'🍪', price:'40¢' },{ emoji:'🍫', price:'$1.20', highlight:true }],
          ].map((shelf, si) => (
            <div key={si} style={{
              background:'#c8a97a', borderRadius:6, padding:'4px 8px',
              border:'2px solid #a08050', display:'flex', gap:6, justifyContent:'space-around',
            }}>
              {shelf.map((it,ii) => (
                <div key={ii} style={{ textAlign:'center' }}>
                  <div style={{ fontSize:'1.1rem' }}>{it.emoji}</div>
                  <div style={{
                    fontFamily:'Fredoka,sans-serif', fontSize:'0.6rem', fontWeight:700,
                    color: it.highlight ? '#e74c3c' : '#5a3e1b',
                  }}>{it.price}</div>
                </div>
              ))}
            </div>
          ))}

          {/* Chocolate bar highlighted */}
          <div style={{
            background:'#5d3318', borderRadius:8, padding:'6px 10px',
            border:'3px solid #3d1f08', textAlign:'center',
          }}>
            <div style={{ fontFamily:'Fredoka,sans-serif', fontSize:'0.65rem', color:'#d4a464', fontWeight:700, letterSpacing:1 }}>CHOCOLATE BAR</div>
            <div style={{ fontFamily:'Fredoka,sans-serif', fontSize:'1.2rem', color:'white', fontWeight:700 }}>80¢</div>
          </div>

          {/* Thank you sign */}
          <div style={{
            position:'absolute', top:8, right:8, background:'white', borderRadius:6,
            padding:'4px 8px', textAlign:'center', border:'1px solid #ddd',
            boxShadow:'0 1px 4px rgba(0,0,0,0.1)',
          }}>
            <div style={{ fontFamily:'Nunito,sans-serif', fontSize:'0.5rem', color:'#3498db', fontWeight:900, lineHeight:1.3 }}>
              Thank you<br/>for shopping<br/>at Sam's Shop!
            </div>
            <div style={{ fontSize:'0.8rem' }}>⭐⭐</div>
          </div>
        </div>

        {/* Emma + thought bubble */}
        <div style={{
          width:'55%', display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center', padding:12, gap:8,
        }}>
          {/* Thought bubble */}
          <div style={{
            background:'white', borderRadius:20, padding:'8px 14px',
            border:'3px solid #ddd', position:'relative',
            boxShadow:'0 3px 10px rgba(0,0,0,0.15)', textAlign:'center',
          }}>
            <span style={{ fontFamily:'Nunito,sans-serif', fontSize:'0.8rem', fontWeight:800, color:'#333' }}>
              Do I have enough money?
            </span>
            {/* Bubble tail dots */}
            {[12,8,5].map((s,i) => (
              <div key={i} style={{
                position:'absolute', bottom:-(12+i*8), left:'40%',
                width:s, height:s, borderRadius:'50%', background:'white',
                border:'2px solid #ddd',
              }}/>
            ))}
          </div>

          {/* Emma character */}
          <div style={{
            fontSize:'4rem', lineHeight:1,
            filter:'drop-shadow(0 3px 6px rgba(0,0,0,0.2))',
          }}>👧</div>

          {/* Purse */}
          <div style={{
            background:'#4ecdc4', borderRadius:12, padding:'6px 10px',
            border:'3px solid #3ab8af', display:'flex', alignItems:'center', gap:6,
            boxShadow:'0 2px 8px rgba(0,0,0,0.2)',
          }}>
            <span style={{ fontSize:'1.5rem' }}>👛</span>
            <span style={{ fontFamily:'Nunito,sans-serif', fontSize:'0.7rem', color:'white', fontWeight:800 }}>
              Emma's Purse
            </span>
          </div>
        </div>
      </div>

      {/* Bottom: What's in Emma's purse + Does she have enough */}
      <div style={{ display:'flex', gap:8, padding:'0 8px 8px', flexShrink:0 }}>

        {/* Purse contents */}
        <div style={{
          flex:1, background:'#fff8ee', borderRadius:10, padding:'8px 10px',
          border:'2px solid #d4b483', boxShadow:'0 2px 6px rgba(0,0,0,0.1)',
        }}>
          <div style={{ fontFamily:'Nunito,sans-serif', fontSize:'0.7rem', fontWeight:800, color:'#333', marginBottom:6, textAlign:'center' }}>
            What's in Emma's purse?
          </div>
          <div style={{ display:'flex', gap:6, justifyContent:'center', flexWrap:'wrap' }}>
            {[
              { emoji:'🪙', label:'25¢', name:'Quarter', color:'#C0C0C0' },
              { emoji:'🪙', label:'10¢', name:'Dime',    color:'#C0C0C0' },
              { emoji:'🪙', label:'5¢',  name:'Nickel',  color:'#C0C0C0' },
              { emoji:'🟤', label:'1¢',  name:'Penny',   color:'#B87333' },
              { emoji:'🟤', label:'1¢',  name:'Penny',   color:'#B87333' },
              { emoji:'🟤', label:'1¢',  name:'Penny',   color:'#B87333' },
            ].map((c,i) => (
              <div key={i} style={{ textAlign:'center' }}>
                <div style={{
                  width:32, height:32, borderRadius:'50%',
                  background: c.color==='#B87333'?'#c87533':'#d0d0d0',
                  border:`2px solid ${c.color==='#B87333'?'#a05020':'#a0a0a0'}`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'0.6rem', fontWeight:800, color: c.color==='#B87333'?'#fff':'#333',
                  fontFamily:'Fredoka,sans-serif',
                }}>{c.label}</div>
                <div style={{ fontFamily:'Nunito,sans-serif', fontSize:'0.5rem', color:'#888', marginTop:1 }}>{c.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Does Emma have enough? */}
        <div style={{
          width:140, background:'#fff8ee', borderRadius:10, padding:'8px 10px',
          border:'2px solid #d4b483', boxShadow:'0 2px 6px rgba(0,0,0,0.1)',
          display:'flex', flexDirection:'column', justifyContent:'center',
        }}>
          <div style={{ fontFamily:'Nunito,sans-serif', fontSize:'0.65rem', fontWeight:800, color:'#333', marginBottom:4, lineHeight:1.4, textAlign:'center' }}>
            Does Emma have enough money to buy the chocolate bar?
          </div>
          <div style={{
            fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700,
            color:'#9b59b6', textAlign:'center',
          }}>Yes or No?</div>
        </div>
      </div>
    </div>
  );
}
