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
    <div className="card border-l-4 border-l-green-500">
      {/* コート名・種別 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 text-lg">{court.name}</h3>
        <span className="badge-green">{formatMatchType(court.match_type)}</span>
      </div>

      {/* チーム対戦表示 */}
      <div className="grid grid-cols-3 gap-3 items-center">
        {/* チーム1 */}
        <div className="bg-blue-50 rounded-xl p-3 text-center">
          <p className="text-xs font-medium text-blue-500 mb-2">チーム 1</p>
          <div className="space-y-1">
            {team1.map((player) => (
              <p key={player.id} className="text-sm font-semibold text-blue-800">
                {player.name}
              </p>
            ))}
          </div>
        </div>

        {/* VS */}
        <div className="text-center">
          <span className="font-black text-2xl text-gray-300">VS</span>
        </div>

        {/* チーム2 */}
        <div className="bg-orange-50 rounded-xl p-3 text-center">
          <p className="text-xs font-medium text-orange-500 mb-2">チーム 2</p>
          <div className="space-y-1">
            {team2.map((player) => (
              <p key={player.id} className="text-sm font-semibold text-orange-800">
                {player.name}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}