import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Edit,
  Eye,
  FileText,
  Pill,
  Plus,
  Trash2,
  User
} from 'lucide-react';
import { useMedicalRecords, usePatientRecords } from '@/hooks/useMedicalRecords';
import { usePermissions } from '@/hooks/usePermissions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Loading } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { formatDateTime } from '@/utils/cn';

const MedicalRecordsPage: React.FC = () => {
  const { medicalRecords, isLoading, createMedicalRecord, deleteMedicalRecord } = useMedicalRecords();
  const { isPatient, isDoctor } = usePermissions();
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleDeleteRecord = (recordId: string) => {
    if (window.confirm('Are you sure you want to delete this medical record?')) {
      deleteMedicalRecord.mutate(recordId);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">Medical Records</h1>
        </div>
        <Loading size="lg" text="Loading medical records..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Medical Records</h1>
          <p className="text-slate-600 mt-1">
            {isPatient ? 'View your medical history and records' : 'Manage patient medical records'}
          </p>
        </div>
        
        {isDoctor && (
          <Button onClick={() => setShowCreateModal(true)} size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Add Record
          </Button>
        )}
      </div>

      {/* Medical Records List */}
      {medicalRecords?.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <EmptyState
              icon={<FileText className="w-8 h-8 text-slate-400" />}
              title="No medical records found"
              description={
                isPatient 
                  ? "Your medical records will appear here when doctors create them"
                  : "Create your first medical record for a patient"
              }
              action={
                isDoctor && (
                  <Button onClick={() => setShowCreateModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Record
                  </Button>
                )
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {medicalRecords?.map((record, index) => (
            <motion.div
              key={record._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">
                          {record.diagnosis}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {isPatient 
                              ? `Dr. ${record.doctor?.firstName} ${record.doctor?.lastName}`
                              : `${record.patient?.firstName} ${record.patient?.lastName}`
                            }
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDateTime(record.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedRecord(record)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      {isDoctor && (
                        <>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeleteRecord(record._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Symptoms</h4>
                      <div className="flex flex-wrap gap-2">
                        {record.symptoms.map((symptom, idx) => (
                          <Badge key={idx} variant="outline">
                            {symptom}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Treatment</h4>
                      <p className="text-slate-600">{record.treatment}</p>
                    </div>

                    {record.medications && record.medications.length > 0 && (
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                          <Pill className="w-4 h-4" />
                          Medications
                        </h4>
                        <div className="space-y-2">
                          {record.medications.map((med, idx) => (
                            <div key={idx} className="p-3 bg-slate-50 rounded-lg">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-slate-900">{med.name}</p>
                                  <p className="text-sm text-slate-600">
                                    {med.dosage} • {med.frequency} • {med.duration}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {record.notes && (
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">Additional Notes</h4>
                        <p className="text-slate-600 p-3 bg-slate-50 rounded-lg">{record.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* View Record Modal */}
      {selectedRecord && (
        <Modal
          isOpen={!!selectedRecord}
          onClose={() => setSelectedRecord(null)}
          title="Medical Record Details"
          size="lg"
        >
          <div className="space-y-4">
            <div className="text-center py-4">
              <FileText className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Medical Record Viewer
              </h3>
              <p className="text-slate-600">
                Detailed medical record viewer would be implemented here
                with full record information, edit capabilities, and print options.
              </p>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Record Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create Medical Record"
          size="xl"
        >
          <div className="text-center py-8">
            <Plus className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Create Medical Record Form
            </h3>
            <p className="text-slate-600 mb-4">
              This would open a comprehensive form for creating medical records
              with patient selection, diagnosis input, symptoms, treatments, and medications.
            </p>
            <Button onClick={() => setShowCreateModal(false)}>
              Close
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export { MedicalRecordsPage };
