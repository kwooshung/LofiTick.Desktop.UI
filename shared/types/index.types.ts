export type { TDeepPartial } from '@@/shared/types/common/deep-partial/index.types';
export type { TVueClass } from '@@/shared/types/common/vue-class/index.types';
export type {
  IHotsearchAdMaterialAsset,
  IHotsearchAdMaterialDetail,
  IHotsearchAdMaterialLine,
  IHotsearchAdMaterialPage,
  IHotsearchAdMaterialSaveResult,
  IHotsearchAdMaterialSummaryRow,
  IPageAdHotsearchEditorAsset,
  IPageAdHotsearchEditorForm,
  IPageAdHotsearchProps,
  IPageTableColumnHotsearchAdMaterial
} from '@@/shared/types/pages/ad/hotsearch/index.types';
export type { IPageCrawlersTargetsProps, IPageCrawlerTargetForm, IQueryResultCrawlerTargetRow, IQueryResultCrawlerTargetSummaryPage } from '@@/shared/types/pages/crawlers/index.types';
export type {
  IPageHomePodcastScriptBodyItem,
  IPageHomePodcastScriptGenerateRequest,
  IPageHomePodcastScriptGenerateResponse,
  IPageHomePodcastScriptLine,
  IPageHomeSendWelcomeEmailResponse,
  IPageHomeWelcomeEmailPayload,
  TPageHomePodcastEdition,
  TPageHomePodcastLength
} from '@@/shared/types/pages/home/index.types';
export type {
  IHotsearchAdDeliveryPlatformOption,
  IHotsearchArchiveDateSummary,
  IHotsearchDataPage,
  IHotsearchDataRow,
  IHotsearchMediaPlatformOption,
  IHotsearchPlatformSummaryPage,
  IHotsearchPlatformSummaryRow,
  IHotsearchPodcastMediaAsset,
  IHotsearchPodcastMediaSource,
  IHotsearchPodcastSentence,
  IHotsearchPodcastViewModel,
  IHotsearchTagSummaryPage,
  IHotsearchTagSummaryRow,
  IQueryResultHotSearchCronAllResponse,
  IQueryResultHotSearchCronPlatformResponse,
  IQueryResultHotSearchDateRecountRequest,
  IQueryResultHotSearchDateRecountResponse,
  IQueryResultHotSearchStoredRow,
  IQueryResultHotSearchUpdateRequest,
  IQueryResultHotSearchUpdateResponse,
  THotsearchAdDeliveryPlatformKind,
  THotsearchMediaPlatformKey,
  THotsearchPodcastVariantKey,
  THotsearchSectionKey
} from '@@/shared/types/pages/hotsearch/index.types';
export type {
  IPagePoetrysDetailInfo,
  IPageTableColumnPoetryAuthors,
  IPageTableColumnPoetryDynasties,
  IPageTableColumnPoetrys,
  IPageTableColumnPoetrysInfos,
  IPageTableColumnPoetrysTime,
  IQueryResultPoetryAuthorsBasicRow,
  IQueryResultPoetryAuthorsSummaryPage,
  IQueryResultPoetryAuthorsSummaryRow,
  IQueryResultPoetryDetailResponse,
  IQueryResultPoetryDynastiesBasicRow,
  IQueryResultPoetryDynastiesSummaryPage,
  IQueryResultPoetryDynastiesSummaryRow,
  IQueryResultPoetryRhythmicBasicRow,
  IQueryResultPoetrySearchAuthorsResponse,
  IQueryResultPoetrySearchDynastiesResponse,
  IQueryResultPoetrySetEnabledResponse,
  IQueryResultPoetrysSummaryPage,
  IQueryResultPoetrysSummaryRow,
  TPoetryKind
} from '@@/shared/types/pages/poetrys/index.types';
export type { IPageQqGroupForm, IPageQqGroupsProps, IPageTableColumnQqGroup, IQueryResultQqGroupsSummaryPage, IQueryResultQqGroupsSummaryRow, IQueryResultSocialQqGroupSummaryPage } from '@@/shared/types/pages/qq-groups/index.types';
export type {
  IPageTableColumnQuoteAuthors,
  IPageTableColumnQuotes,
  IPageTableColumnQuoteSources,
  IQueryResultQuoteAuthorsBasicRow,
  IQueryResultQuoteAuthorsSummaryPage,
  IQueryResultQuotesAuthorsBasicRow,
  IQueryResultQuotesAuthorsSummaryPage,
  IQueryResultQuotesAuthorsSummaryRow,
  IQueryResultQuoteSourcesBasicRow,
  IQueryResultQuoteSourcesSummaryPage,
  IQueryResultQuotesSearchAuthorsResponse,
  IQueryResultQuotesSearchSourcesResponse,
  IQueryResultQuotesSearchUuid,
  IQueryResultQuotesSetEnabledResponse,
  IQueryResultQuotesSourcesBasicRow,
  IQueryResultQuotesSourcesSummaryPage,
  IQueryResultQuotesSourcesSummaryRow,
  IQueryResultQuotesSummaryPage,
  IQueryResultQuotesSummaryRow,
  TQueryResultQuotesSearchUuidResponse
} from '@@/shared/types/pages/quotes/index.types';
export type { IPageSettingsConnectionsSettings, IPageSettingsOnepanelSettings } from '@@/shared/types/pages/settings/cron/index.types';
export type { IPageSettingsLocalCronRow } from '@@/shared/types/pages/settings/cron/page/index.types';
export type {
  ISettingsHotsearch,
  ISettingsHotsearchLocal,
  ISettingsHotsearchPlatformItem,
  ISettingsHotsearchPodcastGenerateOwner,
  ISettingsHotsearchPodcastTemplateItem,
  THotsearchPlatformType,
  THotsearchPodcastHeadMusicKind,
  THotsearchPodcastSegmentType,
  THotsearchPodcastTemplateSegmentType,
  THotsearchPodcastTemplateType,
  THotsearchPodcastVoiceKey
} from '@@/shared/types/pages/settings/hotsearch/index.types';
export type { ISettingsServices, ISettingsServiceVolcSpeech } from '@@/shared/types/pages/settings/services/index.types';
export type {
  IPageSettingsUnattendedMachineCardInfo,
  IPageSettingsUnattendedMachineNetworkGroup,
  IPageSettingsUnattendedMachineNetworkGroups,
  IPageSettingsUnattendedMachineNetworkSnapshot,
  IPageSettingsUnattendedScenesDeleteMachinePayload,
  IPageSettingsUnattendedScenesItem,
  IPageSettingsUnattendedScenesMachineRedisConfig,
  IPageSettingsUnattendedScenesToggleEnabledPayload,
  IPageSettingsUnattendedScenesUpdateMachineRemarkPayload,
  IPageSettingsUnattendedSentinelLogItem,
  IPageSettingsUnattendedSentinelLogsMachineCard,
  IPageSettingsUnattendedSentinelLogsMachineGroup,
  IPageSettingsUnattendedStructuredLogEntry,
  IPageSettingsUnattendedStructuredLogMessage,
  IPageSettingsUnattendedUe5BridgeDetail,
  ISettingsUnattended,
  ISettingsUnattendedScenesLocal,
  ISettingsUnattendedSentinel,
  ISettingsUnattendedSentinelRequest,
  TPageSettingsUnattendedLogMessageSegment,
  TPageSettingsUnattendedMachineNetwork,
  TUnattendedStartBehavior
} from '@@/shared/types/pages/settings/unattended/index.types';
export type { IApiClientConfig, IApiClientConfigPatch, IApiClientRequestInput, IApiClientRequestOutput } from '@@/shared/types/tauri/api-client/index.types';
export type { IOpenFileContentResult, IOpenFileFilter, IOpenFilePayload } from '@@/shared/types/tauri/dialog/index.types';
export type {
  ITauriPodcastGenerateAccepted,
  ITauriPodcastNlpText,
  ITauriPodcastProgress,
  ITauriPodcastRound,
  ITauriPodcastTaskEvent,
  ITauriPodcastTaskResult,
  ITauriPodcastTaskSnapshot,
  ITauriPodcastUsage,
  TTauraPodcastEventType,
  TTauraPodcastTaskPhase,
  TTauraPodcastTaskStatus
} from '@@/shared/types/tauri/podcast/index.types';
export type { ITauriHotsearchScheduleSnapshot, ITauriHotsearchScheduleWindow } from '@@/shared/types/tauri/tasks/index.types';
export type { IWindowSnapshot } from '@@/shared/types/tauri/window/index.types';
