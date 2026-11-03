import { useYellowCardState } from '../hooks/useYellowCardState.js';
import { PDPAForm } from './PDPAForm.js';
import { StudentProfileForm } from './StudentProfileForm.js';
import { GPATable } from './GPATable.js';
import { SystemBanner } from '../../../components/SystemBanner/index.js';

import { YellowCardTitleHeader } from './YellowCardTitleHeader.js';
import { YellowCardWarningBanner } from './YellowCardWarningBanner.js';
import { YellowCardActionBar } from './YellowCardActionBar.js';
import { YellowCardColumns } from './YellowCardColumns.js';
import { YellowCardAdvisorModal } from './YellowCardAdvisorModal.js';
import { YellowCardFooterBar } from './YellowCardFooterBar.js';

export function YellowCardSection() {
  const {
    pdpaAgreed,
    profile,
    subjects,
    showWarningBanner,
    showAdvisorModal,
    successMessage,
    navigate,
    handleConfirmPDPA,
    handleProfileChange,
    handleUpdateSubject,
    handleAddSubject,
    handleDeleteSubject,
    handleImportFromTracker,
    handleSaveYellowCard,
    handleConfirmSubmit,
    handleDismissAdvisorModal,
    handleDismissWarningBanner,
  } = useYellowCardState();

  // Render PDPA view first if not agreed
  if (!pdpaAgreed) {
    return (
      <div className="w-full flex items-center justify-center min-h-[70vh] px-4 bg-[#F7F8F9]/40 py-10">
        <PDPAForm onConfirm={handleConfirmPDPA} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 md:px-8 py-10 md:py-16 font-[ChulaCharasNew] select-none">
      
      {/* Dynamic Success Alert Banner */}
      {successMessage && (
        <SystemBanner
          type="success"
          emphasis="subtle"
          message={successMessage}
          className="mb-6"
        />
      )}

      {/* Main Title Header */}
      <YellowCardTitleHeader />

      {/* Top Warning Banner */}
      {showWarningBanner && (
        <YellowCardWarningBanner onClose={handleDismissWarningBanner} />
      )}

      {/* Student Profile Form */}
      <StudentProfileForm profile={profile} onChange={handleProfileChange} />

      {/* Action Buttons Bar */}
      <YellowCardActionBar
        onImport={handleImportFromTracker}
        onProcess={handleSaveYellowCard}
      />

      {/* Main Grid Workspace - Side-by-Side Dual Column on desktop */}
      <YellowCardColumns
        subjects={subjects}
        major={profile.major}
        onUpdateSubject={handleUpdateSubject}
        onAddSubject={handleAddSubject}
        onDeleteSubject={handleDeleteSubject}
      />

      {/* Cumulative GPA calculation grid */}
      <GPATable subjects={subjects} />

      {/* Floating Save Actions Bar at bottom */}
      <YellowCardFooterBar
        onCancel={() => navigate('/forms')}
        onSave={handleSaveYellowCard}
      />

      {/* Advisor Warning Confirmation Modal */}
      {showAdvisorModal && (
        <YellowCardAdvisorModal
          onConfirm={handleConfirmSubmit}
          onGoToTracker={() => {
            handleDismissAdvisorModal();
            navigate('/credit-tracking');
          }}
          onClose={handleDismissAdvisorModal}
        />
      )}

    </div>
  );
}
