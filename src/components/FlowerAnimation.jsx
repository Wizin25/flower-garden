import { useState, useEffect, useMemo } from 'react'

import lilyBg from '/assets/lily-bg.png' // đường dẫn background import từ assets

// Load tất cả ảnh hoa từ folder ly_flower
const flowerImages = Object.values(
  import.meta.glob('/ly_flower/*.{png,jpg,jpeg,webp,svg,PNG,JPG,JPEG,WEBP}', {
    eager: true,
    as: 'url',
  })
)

// Seed hoa 1 lần duy nhất, không re-random khi re-render
function buildFlowers(images) {
  const TOTAL = 100

  return Array.from({ length: TOTAL }, (_, i) => {
    const img = images[i % images.length]

    // X nằm random tràn viền, hoa có thể bắt đầu từ ngoài màn hình rộng hơn [-15vw, 115vw]
    const xPercent = Math.random() * 130 - 15

    // Y rơi từ ngoài cùng phía trên (-40 → -55%), nhưng kết thúc thì có hoa rơi chưa tới đáy, có hoa rơi full đáy, để phủ đều màn hình
    const startYPercent = -40 - Math.random() * 15   // [-40, -55]%
    // Tạo xác suất cho việc một số hoa chỉ rơi tới phần giữa hoặc cuối màn, một số thì rơi luôn qua đáy màn hình
    let endYPercent
    const rand = Math.random()
    // Thêm nhiều khúc, phân bố dày hơn ở nhiều đoạn
    // tăng density/dày hơn với nhiều phân khúc nhỏ hơn và phần trăm dồn nhiều ở giữa, đáy
    // Giản cách đều toàn bộ dọc theo vùng rơi, từ 35% tới 190% mỗi đoạn bằng nhau
    const minY = -20;
    const maxY = 250;
    const segmentCount = 20;
    const segmentSize = (maxY - minY) / segmentCount;
    let segmentIdx = Math.floor(rand * segmentCount); // từ 0 tới 7

    // Nếu rand === 1 chính xác thì cho vào segment cuối cùng
    if (segmentIdx >= segmentCount) segmentIdx = segmentCount - 1;

    // Đặt start và end cho segment này
    const segStart = minY + segmentIdx * segmentSize;
    const segEnd = segStart + segmentSize;

    endYPercent = segStart + Math.random() * segmentSize;

    // Kích thước: 140–320px (giữ nguyên)
    const size = 150 + Math.random() * 180

    // Hiệu ứng xoay: quay chậm, ít vòng, thậm chí hoa nhè nhẹ đúng hướng gió
    const startRotation = Math.random() * 360 - 180
    const endRotation = startRotation + (Math.random() < 0.5 ? 360 : -360) * (0.7 + Math.random() * 1.2)

    // Rơi với tốc độ riêng, chậm hơn: 2.5s–4.3s, delay rộng hơn [0, 1.2]s
    const fallTime = 2.5 + Math.random() * 1.8 // [2.5, 4.3]s
    const fallDelay = Math.random() * 1.2      // [0, 1.2]s

    return {
      id: i,
      img,
      xPercent,
      startYPercent,
      endYPercent,
      size,
      startRotation,
      endRotation,
      fallTime,
      fallDelay,
    }
  })
}

export default function FlowerAnimation({ onComplete }) {
  const [stage, setStage] = useState('flying')
  const flowers = useMemo(
    () => buildFlowers(flowerImages.length ? flowerImages : [null]),
    []
  )

  useEffect(() => {
    // Tính duration lớn nhất trong các hoa để biết khi nào xong animation
    const maxDuration =
      Math.max(
        ...flowers.map(f => f.fallTime + f.fallDelay)
      ) * 1000 + 0 // cộng thêm ít để chắc chắn hoa rơi xong

    if (stage === 'flying') {
      const to = setTimeout(() => setStage('done'), maxDuration)
      return () => clearTimeout(to)
    }
    if (stage === 'done') onComplete?.()
  }, [stage, flowers, onComplete])

  // Tính toán transform cho từng stage (stage chỉ có flying/rơi → done)
  const getTransform = (f) => {
    if (stage === 'flying') {
      // rơi từ trên xuống dưới với xoay
      return {
        from: `translateX(calc(${f.xPercent}vw - 50%)) translateY(${f.startYPercent}%) rotate(${f.startRotation}deg)`,
        to:   `translateX(calc(${f.xPercent}vw - 50%)) translateY(${f.endYPercent}%) rotate(${f.endRotation}deg)`,
      }
    }
    // khi done rồi: giữ nguyên ở vị trí đã rơi tới, không cần ép hết xuống đáy nữa
    return {
      from: `translateX(calc(${f.xPercent}vw - 50%)) translateY(${f.endYPercent}%) rotate(${f.endRotation}deg)`,
      to:   `translateX(calc(${f.xPercent}vw - 50%)) translateY(${f.endYPercent}%) rotate(${f.endRotation}deg)`,
    }
  }

  // Tính toán timing function từng hoa
  const getTransition = (f) =>
    `transform ${f.fallTime}s cubic-bezier(0.3,0.9,0.22,1) ${f.fallDelay}s`

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        overflow: 'hidden',
        backgroundImage: `url(${lilyBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        pointerEvents: 'none',
      }}
    >
      {flowers.map((f) => {
        const { from, to } = getTransform(f)
        return (
          <div
            key={f.id}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: f.size,
              height: f.size,
              transform: stage === 'flying' ? from : to,
              transition: stage === 'flying' ? getTransition(f) : 'none',
              willChange: 'transform',
              pointerEvents: 'none',
            }}
            // Để kick animation, trigger style update (mounted là from, sau tick là to)
            ref={el => {
              if (el && stage === 'flying') {
                // Kick animation 1 tick sau khi mounted by forcing reflow & set transform to "to"
                requestAnimationFrame(() => {
                  el.style.transform = to
                })
              }
            }}
          >
            {f.img ? (
              <img
                src={f.img}
                alt=""
                aria-hidden="true"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.25))',
                  userSelect: 'none',
                }}
              />
            ) : (
              <span
                aria-hidden="true"
                style={{
                  display: 'block',
                  width: '100%',
                  height: '100%',
                  fontSize: f.size * 0.75,
                  lineHeight: 1,
                  textAlign: 'center',
                  userSelect: 'none',
                }}
              >
                🌸
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
