import {
  Skeleton as AntdSkeleton,
  SkeletonProps as AntdSkeletonProps,
} from 'antd'

type SkeletonProps = Expand<AntdSkeletonProps>

const Skeleton = (props: SkeletonProps) => {
  return <AntdSkeleton {...props} />
}

export { Skeleton }
