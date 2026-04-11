// src/components/matching/MatchingResultCard.tsx
// 振り分け結果の1コート分カード

import type { CourtAssignment } from '@/types'
import { formatMatchType } from '@/lib/utils'

type Props = {
  assignment: CourtAssignment
}

export function MatchingResultCard({ assignment }: Props) {
  const { court, team1, team2 } = assignment

  return (
    <div className="card border-l-[6px] border-l-brand-teal">
      {/* コート名・種別 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 text-lg">{court.name}</h3>
        <span className="badge-green">{formatMatchType(court.match_type)}</span>
      </div>

      {/* チーム対戦表示（狭い画面は縦積み、md 以上は 3 列） */}
      <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-3">
        {/* チーム1 */}
        <div className="rounded-[1rem] border-2 border-brand-sky/40 bg-brand-sky-soft p-3 text-center">
          <p className="mb-2 text-xs font-semibold text-brand-ocean">チーム 1</p>
          <div className="space-y-1">
            {team1.map((player) => (
              <p key={player.id} className="break-words text-sm font-semibold text-gray-900">
                {player.name}
              </p>
            ))}
          </div>
        </div>

        {/* VS */}
        <div className="py-0.5 text-center md:py-0">
          <span className="font-black text-2xl text-gray-300">VS</span>
        </div>

        {/* チーム2 */}
        <div className="rounded-[1rem] border-2 border-brand-orange/40 bg-brand-orange-soft p-3 text-center">
          <p className="mb-2 text-xs font-semibold text-brand-orange">チーム 2</p>
          <div className="space-y-1">
            {team2.map((player) => (
              <p key={player.id} className="break-words text-sm font-semibold text-gray-900">
                {player.name}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}