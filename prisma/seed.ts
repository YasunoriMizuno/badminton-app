import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 最初のサークルを取得（/setup で作成済みであること）
  const circle = await prisma.circle.findFirst({ orderBy: { created_at: 'asc' } })
  if (!circle) {
    console.error('❌ サークルが見つかりません。先に /setup でサークルを作成してください。')
    process.exit(1)
  }
  console.log(`✅ サークル「${circle.name}」にシードデータを投入します`)

  // 既存データを削除（再実行可能にする）
  await prisma.match.deleteMany({ where: { circle_id: circle.id } })
  await prisma.court.deleteMany({ where: { circle_id: circle.id } })
  await prisma.player.deleteMany({ where: { circle_id: circle.id } })

  // 参加者を作成
  const players = await Promise.all([
    prisma.player.create({ data: { name: '田中 健太', level: 4, gender: 'male',   circle_id: circle.id, is_present: false } }),
    prisma.player.create({ data: { name: '鈴木 美咲', level: 3, gender: 'female', circle_id: circle.id, is_present: false } }),
    prisma.player.create({ data: { name: '佐藤 拓也', level: 5, gender: 'male',   circle_id: circle.id, is_present: false } }),
    prisma.player.create({ data: { name: '伊藤 さくら', level: 2, gender: 'female', circle_id: circle.id, is_present: false } }),
    prisma.player.create({ data: { name: '山田 翔太', level: 3, gender: 'male',   circle_id: circle.id, is_present: false } }),
    prisma.player.create({ data: { name: '中村 愛', level: 4, gender: 'female', circle_id: circle.id, is_present: false } }),
    prisma.player.create({ data: { name: '小林 大輝', level: 2, gender: 'male',   circle_id: circle.id, is_present: false } }),
    prisma.player.create({ data: { name: '加藤 莉奈', level: 3, gender: 'female', circle_id: circle.id, is_present: false } }),
    prisma.player.create({ data: { name: '渡辺 隼人', level: 5, gender: 'male',   circle_id: circle.id, is_present: false } }),
    prisma.player.create({ data: { name: '松本 ひなた', level: 1, gender: 'female', circle_id: circle.id, is_present: false } }),
  ])
  console.log(`✅ 参加者 ${players.length}人 を作成しました`)

  // コートを作成
  const [courtA, courtB] = await Promise.all([
    prisma.court.create({ data: { name: 'コートA', match_type: 'doubles', circle_id: circle.id } }),
    prisma.court.create({ data: { name: 'コートB', match_type: 'doubles', circle_id: circle.id } }),
  ])
  console.log('✅ コート 2面 を作成しました')

  // 試合結果を作成（ランキングに反映されるよう winner_team を設定）
  const matchData = [
    { court_id: courtA.id, team1: [players[0].id, players[1].id], team2: [players[2].id, players[3].id], winner: 1, score: '21-15' },
    { court_id: courtB.id, team1: [players[4].id, players[5].id], team2: [players[6].id, players[7].id], winner: 2, score: '18-21' },
    { court_id: courtA.id, team1: [players[2].id, players[5].id], team2: [players[0].id, players[8].id], winner: 1, score: '21-19' },
    { court_id: courtB.id, team1: [players[1].id, players[9].id], team2: [players[3].id, players[4].id], winner: 1, score: '21-14' },
    { court_id: courtA.id, team1: [players[6].id, players[8].id], team2: [players[7].id, players[9].id], winner: 2, score: '16-21' },
    { court_id: courtB.id, team1: [players[0].id, players[3].id], team2: [players[2].id, players[4].id], winner: 2, score: '19-21' },
    { court_id: courtA.id, team1: [players[5].id, players[8].id], team2: [players[1].id, players[6].id], winner: 1, score: '21-17' },
    { court_id: courtB.id, team1: [players[7].id, players[9].id], team2: [players[0].id, players[5].id], winner: 1, score: '21-18' },
    { court_id: courtA.id, team1: [players[2].id, players[7].id], team2: [players[3].id, players[8].id], winner: 1, score: '21-11' },
    { court_id: courtB.id, team1: [players[1].id, players[4].id], team2: [players[6].id, players[9].id], winner: 2, score: '20-22' },
    { court_id: courtA.id, team1: [players[0].id, players[7].id], team2: [players[4].id, players[5].id], winner: 1, score: '21-16' },
    { court_id: courtB.id, team1: [players[2].id, players[9].id], team2: [players[1].id, players[3].id], winner: 1, score: '21-13' },
  ]

  const baseDate = new Date()
  for (let i = 0; i < matchData.length; i++) {
    const m = matchData[i]
    const playedAt = new Date(baseDate)
    playedAt.setDate(baseDate.getDate() - Math.floor(i / 4))
    playedAt.setMinutes(baseDate.getMinutes() - i * 30)

    await prisma.match.create({
      data: {
        circle_id: circle.id,
        court_id: m.court_id,
        match_type: 'doubles',
        team1_player_ids: m.team1,
        team2_player_ids: m.team2,
        winner_team: m.winner,
        score: m.score,
        played_at: playedAt,
      },
    })
  }
  console.log(`✅ 試合結果 ${matchData.length}件 を作成しました`)
  console.log('🎉 シードデータの投入が完了しました！')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
