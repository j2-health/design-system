import { ThemeConfig } from 'antd'

export const appTheme: ThemeConfig = {
  token: {
    // Colors
    colorText: 'var(--j2-color-text)',
    colorTextSecondary: 'var(--j2-color-text-secondary)',
    colorTextTertiary: 'var(--j2-color-text-tertiary)',
    colorTextQuaternary: 'var(--j2-color-text-quaternary)',
    colorTextHeading: 'var(--j2-color-text-heading)',
    colorTextLabel: 'var(--j2-color-text-label)',
    colorTextDescription: 'var(--j2-color-text-description)',
    colorTextDisabled: 'var(--j2-color-text-disabled)',
    colorTextPlaceholder: 'var(--j2-color-text-placeholder)',
    colorIcon: 'var(--j2-color-icon)',
    colorIconHover: 'var(--j2-color-icon-hover)',
    colorBgLayout: 'var(--j2-color-bg-layout)',
    colorBorder: 'var(--j2-color-border)',
    colorBorderSecondary: 'var(--j2-color-border-secondary)',
    colorPrimary: '#253761', // var(--j2-blue-9)
    colorSuccess: '#57a45e', // var(--j2-green-9)
    colorWarning: '#9e6e00', // var(--j2-gold-11)
    colorInfo: '#253761', // var(--j2-blue-9)
    colorLink: '#253761', // var(--j2-blue-9)
    colorError: '#bf6c6f', // var(--j2-red-9)
    colorErrorBg: 'var(--j2-color-error-bg)',
    colorErrorBgHover: 'var(--j2-color-error-bg-hover)',
    colorErrorBorder: 'var(--j2-color-error-border)',
    colorErrorBorderHover: 'var(--j2-color-error-border-hover)',
    colorErrorHover: 'var(--j2-color-error-hover)',
    colorErrorActive: 'var(--j2-color-error-active)',
    colorErrorTextHover: 'var(--j2-color-error-text-hover)',
    colorErrorText: 'var(--j2-color-error-text)',
    colorErrorTextActive: 'var(--j2-color-error-text-active)',
    colorLinkHover: 'var(--j2-color-link-hover)',
    colorInfoBg: 'var(--j2-color-info-bg)',
    colorInfoBgHover: 'var(--j2-color-info-bg-hover)',
    colorInfoBorder: 'var(--j2-color-info-border)',
    colorInfoBorderHover: 'var(--j2-color-info-border-hover)',
    colorInfoHover: 'var(--j2-color-info-hover)',
    colorInfoActive: 'var(--j2-color-info-active)',
    colorInfoTextHover: 'var(--j2-color-info-text-hover)',
    colorInfoText: 'var(--j2-color-info-text)',
    colorInfoTextActive: 'var(--j2-color-info-text-active)',
    colorLinkActive: 'var(--j2-color-link-active)',
    colorPrimaryBg: 'var(--j2-color-primary-bg)',
    colorPrimaryBgHover: 'var(--j2-color-primary-bg-hover)',
    colorPrimaryBorder: 'var(--j2-color-primary-border)',
    colorPrimaryBorderHover: 'var(--j2-color-primary-border-hover)',
    colorPrimaryHover: 'var(--j2-color-primary-hover)',
    colorPrimaryActive: 'var(--j2-color-primary-active)',
    colorPrimaryTextHover: 'var(--j2-color-primary-text-hover)',
    colorPrimaryText: 'var(--j2-color-primary-text)',
    colorPrimaryTextActive: 'var(--j2-color-primary-text-active)',
    colorSuccessBg: 'var(--j2-color-success-bg)',
    colorSuccessBgHover: 'var(--j2-color-success-bg-hover)',
    colorSuccessBorder: 'var(--j2-color-success-border)',
    colorSuccessBorderHover: 'var(--j2-color-success-border-hover)',
    colorSuccessHover: 'var(--j2-color-success-hover)',
    colorSuccessActive: 'var(--j2-color-success-active)',
    colorSuccessTextHover: 'var(--j2-color-success-text-hover)',
    colorSuccessText: 'var(--j2-color-success-text)',
    colorSuccessTextActive: 'var(--j2-color-success-text-active)',
    colorWarningBg: 'var(--j2-color-warning-bg)',
    colorWarningBgHover: 'var(--j2-color-warning-bg-hover)',
    colorWarningBorder: 'var(--j2-color-warning-border)',
    colorWarningBorderHover: 'var(--j2-color-warning-border-hover)',
    colorWarningHover: 'var(--j2-color-warning-hover)',
    colorWarningActive: 'var(--j2-color-warning-active)',
    colorWarningTextHover: 'var(--j2-color-warning-text-hover)',
    colorWarningText: 'var(--j2-color-warning-text)',
    colorWarningTextActive: 'var(--j2-color-warning-text-active)',
    controlItemBgActive: 'var(--j2-control-item-bg-active)',
    controlItemBgActiveHover: 'var(--j2-control-item-bg-active-hover)',
    colorFill: 'var(--j2-color-fill)',
    colorFillSecondary: 'var(--j2-color-fill-secondary)',
    colorFillTertiary: 'var(--j2-color-fill-tertiary)',
    colorFillQuaternary: 'var(--j2-color-fill-quaternary)',
    colorFillContent: 'var(--j2-color-fill-content)',
    colorFillContentHover: 'var(--j2-color-fill-content-hover)',
    colorBgMask: 'var(--j2-color-bg-mask)',
    colorBgSpotlight: 'var(--j2-color-bg-spotlight)',
    colorBgContainerDisabled: 'var(--j2-color-bg-container-disabled)',
    colorBgTextActive: 'var(--j2-color-bg-text-active)',
    colorBgTextHover: 'var(--j2-color-bg-text-hover)',
    colorFillAlter: 'var(--j2-color-fill-alter)',
    colorSplit: 'var(--j2-color-split)',
    colorErrorOutline: 'var(--j2-color-error-outline)',
    colorWarningOutline: 'var(--j2-color-warning-outline)',
    controlItemBgActiveDisabled: 'var(--j2-control-item-bg-active-disabled)',
    controlItemBgHover: 'var(--j2-control-item-bg-hover)',
    controlOutline: 'var(--j2-control-outline)',
    controlTmpOutline: 'var(--j2-control-tmp-outline)',

    // Typography
    fontFamily: 'Rubik, sans-serif',
    fontFamilyCode: 'Rubik, sans-serif',
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeSM: 12,
    fontSizeXL: 20,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,
    lineHeight: 1.5714285714285714,
    lineHeightHeading1: 1.2105263157894737,
    lineHeightHeading2: 1.2666666666666666,
    lineHeightHeading3: 1.3333333333333333,
    lineHeightHeading4: 1.4,
    lineHeightHeading5: 1.5,
    lineHeightLG: 1.5,
    lineHeightSM: 1.6666666666666667,
    fontSizeIcon: 12,
    fontWeightStrong: 600,

    // Border
    borderRadius: 8,
    borderRadiusLG: 10,
    borderRadiusSM: 6,
    borderRadiusXS: 2,

    // Spacing and sizing
    sizeStep: 4,
    sizeUnit: 4,
    controlInteractiveSize: 16,
    size: 16,
    sizeLG: 24,
    sizeMD: 20,
    sizeMS: 16,
    sizeSM: 12,
    sizeXL: 32,
    sizeXS: 8,
    sizeXXL: 48,
    controlHeight: 32,
    sizeXXS: 4,
    controlHeightLG: 40,
    controlHeightSM: 24,
    controlHeightXS: 16,
    lineWidth: 1,
    lineWidthBold: 2,
    lineWidthFocus: 4,
    controlOutlineWidth: 2,
    screenLG: 992,
    screenLGMax: 1199,
    screenLGMin: 992,
    screenMD: 768,
    screenMDMax: 991,
    screenMDMin: 768,
    screenSM: 576,
    screenSMMax: 767,
    screenSMMin: 576,
    screenXL: 1200,
    screenXLMax: 1599,
    screenXLMin: 1200,
    screenXS: 480,
    screenXSMax: 575,
    screenXSMin: 480,
    screenXXL: 1600,
    screenXXLMin: 1600,
    sizePopupArrow: 16,
    margin: 16,
    marginLG: 24,
    marginMD: 20,
    marginSM: 12,
    marginXL: 32,
    marginXS: 8,
    marginXXL: 48,
    marginXXS: 4,
    padding: 16,
    paddingLG: 24,
    paddingMD: 20,
    paddingSM: 12,
    paddingXL: 32,
    paddingXS: 8,
    paddingXXS: 4,
    paddingContentHorizontal: 16,
    paddingContentHorizontalLG: 24,
    paddingContentHorizontalSM: 16,
    paddingContentVertical: 12,
    paddingContentVerticalLG: 16,
    paddingContentVerticalSM: 8,
    controlPaddingHorizontal: 12,
    controlPaddingHorizontalSM: 8,
  },
  components: {
    Breadcrumb: {
      itemColor: 'var(--j2-color-text-label)',
      lastItemColor: 'var(--j2-color-primary)',
      linkColor: 'inherit',
      linkHoverColor: 'var(--j2-color-link-hover)',
      colorBgTextHover: 'var(--j2-color-primary-bg-hover)',
    },
    Button: {
      defaultColor: 'var(--j2-color-primary-text)',
      defaultBorderColor: 'var(--j2-color-border)',
      defaultHoverBorderColor: 'var(--j2-color-primary-active)',
      defaultActiveBorderColor: 'var(--j2-color-primary-active)',
      ghostBg: '#fff',
      defaultGhostBorderColor: 'var(--j2-color-primary)',
      defaultGhostColor: 'var(--j2-color-primary-text)',
      textTextColor: 'var(--j2-color-primary-text)',
      textHoverBg: 'var(--j2-gray-2)',
      textTextHoverColor: 'var(--j2-color-primary-text-hover)',
      textTextActiveColor: 'var(--j2-color-primary-text-active)',
    },
    Form: {
      itemMarginBottom: 0,
      labelHeight: '100%',
    },
    Input: {
      activeBorderColor: 'var(--j2-color-primary-active)',
    },
    InputNumber: {
      handleVisible: true,
      handleHoverColor: 'var(--j2-color-primary-text)',
      handleBorderColor: 'var(--j2-color-border)',
      handleBg: 'var(--j2-color-bg-container-disabled)',
    },
    Menu: {
      itemColor: 'var(--j2-color-primary-text)',
      itemSelectedBg: 'var(--j2-color-primary)',
      itemSelectedColor: '#fff',
      itemMarginInline: 12,
    },
    Rate: {
      marginXS: 0,
    },
    Select: {
      multipleItemBg: 'var(--j2-gray-2)',
      multipleItemBorderColor: 'var(--j2-gray-4)',
      colorText: 'var(--j2-color-primary-text)',
    },
    Tooltip: {
      colorBgSpotlight: 'var(--j2-color-primary-active)',
    },
    Table: {
      headerBg: 'var(--j2-color-bg-layout)',
      rowHoverBg: 'var(--j2-color-bg-layout)',
      bodySortBg: 'var(--j2-gray-2)',
      headerSortHoverBg: 'var(--j2-gray-3)',
      headerSortActiveBg: 'var(--j2-gray-3)',
      fixedHeaderSortActiveBg: 'var(--j2-gray-3)',
    },
    Tag: {
      defaultBg: 'var(--j2-color-fill-secondary)',
    },
  },
}
