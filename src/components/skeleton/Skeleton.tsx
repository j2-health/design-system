import {
  Skeleton as AntdSkeleton,
  SkeletonProps as AntdSkeletonProps,
} from 'antd'

type SkeletonProps = Expand<AntdSkeletonProps>

const Skeleton = (props: SkeletonProps) => {
  return <AntdSkeleton {...props} />
}

Skeleton.Node = AntdSkeleton.Node
Skeleton.Avatar = AntdSkeleton.Avatar
Skeleton.Input = AntdSkeleton.Input
Skeleton.Image = AntdSkeleton.Image
Skeleton.Button = AntdSkeleton.Button

export { Skeleton }
