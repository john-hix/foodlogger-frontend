import React, {useEffect} from 'react'

export default function Step3Diet (props: {
    saveSelectedGoal: (selectedGoal: number) => void
}) {

    return (
        <div>
            <p>Select a suggested diet plan</p>
            <ul>
                <li>Diet plan cards</li>
            </ul>
        </div>
    )

}
