import React from 'react';
import './SkeletonHeader.css';
import {Skeleton} from 'antd';

export function SkeletonHeader() {
    return (
        <div className={'skeletonHeader'}>
            <Skeleton.Image/>
            <Skeleton.Button active={true} size={'small'} shape={'circle'} className={'SkeletonButton'}/>
        </div>
    )
}
