import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { SectionWrapper } from '../../../components';
import { useTheme } from '@mui/material/styles';
import { useAlerts } from '../../../hooks/useAlerts';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import {
  DEFAULT_OPPORTUNITIES_CONTENT,
  getOpportunitiesContent,
  saveOpportunitiesContent,
} from '../../../services/opportunitiesContentService';

const AdminOpportunities = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const showDialog = useAlerts('dialog');

  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState(DEFAULT_OPPORTUNITIES_CONTENT);

  useEffect(() => {
    let isMounted = true;
    getOpportunitiesContent().then((data) => {
      if (isMounted && data) {
        setContent(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveOpportunitiesContent(content);
      showDialog(
        'Saved Successfully',
        'Opportunities page content has been saved to Cloud Firestore and is now live!',
        'OK'
      );
    } catch (err) {
      console.error('Error saving opportunities content:', err);
      showDialog('Error', `Failed to save content to Firestore: ${err.message}`, 'OK');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Are you sure you want to reset all opportunities content back to lab defaults?')) {
      setContent(DEFAULT_OPPORTUNITIES_CONTENT);
    }
  };

  // 1. Header Handlers
  const handleHeaderChange = (field, value) => {
    setContent((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        [field]: value,
      },
    }));
  };

  // 2. Financial Support Handlers
  const handleFinancialChange = (field, value) => {
    setContent((prev) => ({
      ...prev,
      financialSupport: {
        ...prev.financialSupport,
        [field]: value,
      },
    }));
  };

  // 3. Open Positions Handlers
  const handlePositionsMetaChange = (field, value) => {
    setContent((prev) => ({
      ...prev,
      openPositions: {
        ...prev.openPositions,
        [field]: value,
      },
    }));
  };

  const handlePositionChange = (index, field, value) => {
    const list = [...(content.openPositions.positions || [])];
    list[index] = { ...list[index], [field]: value };
    handlePositionsMetaChange('positions', list);
  };

  const handleAddPosition = () => {
    const list = [...(content.openPositions.positions || [])];
    list.push({
      id: `pos-${Date.now()}`,
      role: 'New Position Title',
      terms: 'Full-time · Fellowship',
      focus: 'Description of research domains, duties, or requirements...',
      tag: 'OPEN',
    });
    handlePositionsMetaChange('positions', list);
  };

  const handleDeletePosition = (index) => {
    const list = (content.openPositions.positions || []).filter((_, i) => i !== index);
    handlePositionsMetaChange('positions', list);
  };

  // 4. Application Instructions Handlers
  const handleInstructionsMetaChange = (field, value) => {
    setContent((prev) => ({
      ...prev,
      applicationInstructions: {
        ...prev.applicationInstructions,
        [field]: value,
      },
    }));
  };

  const handleChecklistChange = (index, value) => {
    const list = [...(content.applicationInstructions.checklist || [])];
    list[index] = value;
    handleInstructionsMetaChange('checklist', list);
  };

  const handleAddChecklistItem = () => {
    const list = [...(content.applicationInstructions.checklist || [])];
    list.push('New required document or item');
    handleInstructionsMetaChange('checklist', list);
  };

  const handleDeleteChecklistItem = (index) => {
    const list = (content.applicationInstructions.checklist || []).filter((_, i) => i !== index);
    handleInstructionsMetaChange('checklist', list);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress size={36} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', pb: 10 }}>
      {/* Top Action Bar Header */}
      <Box
        sx={{
          pt: { xs: 5, md: 7 },
          pb: { xs: 4, md: 5 },
          background: isDark
            ? 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59, 130, 246, 0.18), transparent 70%), #080B11'
            : 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(37, 99, 235, 0.08), transparent 70%), #F8FAFC',
          borderBottom: '1px solid',
          borderColor: theme.palette.divider,
        }}
      >
        <SectionWrapper showBottomLine={false}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'flex-start', md: 'center' },
              justifyContent: 'space-between',
              gap: 3,
            }}
          >
            <Box sx={{ maxWidth: '750px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: isDark ? '#60A5FA' : '#1D4ED8',
                  }}
                >
                  Admin Console / Opportunities Editor
                </Typography>
              </Box>
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  color: theme.palette.text.primary,
                  mb: 1.5,
                }}
              >
                Opportunities Page Management
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: { xs: '0.95rem', md: '1.05rem' },
                  lineHeight: 1.6,
                }}
              >
                Manage prospective student recruiting, stipends, open researcher positions, and application instructions saved in Cloud Firestore.
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<RestartAltIcon />}
                onClick={handleResetDefaults}
                sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, py: 1 }}
              >
                Reset Defaults
              </Button>
              <Button
                variant="contained"
                startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                onClick={handleSave}
                disabled={saving}
                sx={{
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 3,
                  py: 1.1,
                  background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                }}
              >
                {saving ? 'Saving...' : 'Save to Firestore'}
              </Button>
            </Box>
          </Box>
        </SectionWrapper>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: '1px solid', borderColor: theme.palette.divider, mb: 4 }}>
        <SectionWrapper showBottomLine={false}>
          <Tabs
            value={tabValue}
            onChange={(_, val) => setTabValue(val)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.95rem',
                minHeight: '56px',
                px: 2.5,
              },
            }}
          >
            <Tab icon={<AttachMoneyOutlinedIcon fontSize="small" />} iconPosition="start" label="Header & Financial Support" />
            <Tab
              icon={<WorkOutlineIcon fontSize="small" />}
              iconPosition="start"
              label={`Open Positions (${content.openPositions.positions?.length || 0})`}
            />
            <Tab icon={<SchoolOutlinedIcon fontSize="small" />} iconPosition="start" label="Application Checklist & Email" />
          </Tabs>
        </SectionWrapper>
      </Box>

      {/* Content Body */}
      <SectionWrapper showBottomLine={false}>
        {/* Tab 0: Header & Financial Support */}
        {tabValue === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
            {/* Page Hero Header */}
            <Card
              sx={{
                borderRadius: '16px',
                backgroundColor: isDark ? 'rgba(15, 21, 35, 0.75)' : '#FFFFFF',
                border: '1px solid',
                borderColor: theme.palette.divider,
              }}
            >
              <Box
                sx={{
                  px: 3,
                  py: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  backgroundColor: isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(37, 99, 235, 0.04)',
                  borderBottom: '1px solid',
                  borderColor: theme.palette.divider,
                }}
              >
                <SchoolOutlinedIcon sx={{ color: isDark ? '#60A5FA' : '#2563EB' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Page Hero & Overview
                </Typography>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Eyebrow Badge"
                      value={content.header.eyebrow}
                      onChange={(e) => handleHeaderChange('eyebrow', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Main Page Title"
                      value={content.header.title}
                      onChange={(e) => handleHeaderChange('title', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      size="small"
                      label="Lead Summary / Description"
                      value={content.header.description}
                      onChange={(e) => handleHeaderChange('description', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Financial Support Banner */}
            <Card
              sx={{
                borderRadius: '16px',
                backgroundColor: isDark ? 'rgba(15, 21, 35, 0.75)' : '#FFFFFF',
                border: '1px solid',
                borderColor: theme.palette.divider,
              }}
            >
              <Box
                sx={{
                  px: 3,
                  py: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  backgroundColor: isDark ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.04)',
                  borderBottom: '1px solid',
                  borderColor: theme.palette.divider,
                }}
              >
                <AttachMoneyOutlinedIcon sx={{ color: '#10B981' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Financial Support & Stipend Banner
                </Typography>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Grid container spacing={2.5}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Banner Heading"
                      value={content.financialSupport.title}
                      onChange={(e) => handleFinancialChange('title', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      size="small"
                      label="Funding Details"
                      value={content.financialSupport.description}
                      onChange={(e) => handleFinancialChange('description', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Tab 1: Open Positions */}
        {tabValue === 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
            {/* Section Heading Card */}
            <Card
              sx={{
                borderRadius: '16px',
                backgroundColor: isDark ? 'rgba(15, 21, 35, 0.75)' : '#FFFFFF',
                border: '1px solid',
                borderColor: theme.palette.divider,
              }}
            >
              <Box
                sx={{
                  px: 3,
                  py: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(37, 99, 235, 0.04)',
                  borderBottom: '1px solid',
                  borderColor: theme.palette.divider,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <WorkOutlineIcon sx={{ color: isDark ? '#60A5FA' : '#2563EB' }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Section Titles & Positions ({content.openPositions.positions?.length || 0})
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={handleAddPosition}
                  sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
                >
                  + Add Position
                </Button>
              </Box>

              <CardContent sx={{ p: 3 }}>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Section Title"
                      value={content.openPositions.title}
                      onChange={(e) => handlePositionsMetaChange('title', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Section Subtitle"
                      value={content.openPositions.subtitle}
                      onChange={(e) => handlePositionsMetaChange('subtitle', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Individual Position Cards */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {(content.openPositions.positions || []).map((pos, index) => (
                <Card
                  key={pos.id || index}
                  sx={{
                    borderRadius: '16px',
                    backgroundColor: isDark ? 'rgba(15, 21, 35, 0.75)' : '#FFFFFF',
                    border: '1px solid',
                    borderColor: theme.palette.divider,
                  }}
                >
                  <Box
                    sx={{
                      px: 3,
                      py: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                      borderBottom: '1px solid',
                      borderColor: theme.palette.divider,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Position #{index + 1}: {pos.role}
                      </Typography>
                      <Chip
                        label={(pos.tag || 'OPEN').toUpperCase() === 'CLOSED' ? 'CLOSED' : 'OPEN'}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.68rem',
                          borderRadius: '9999px',
                          backgroundColor:
                            (pos.tag || 'OPEN').toUpperCase() === 'CLOSED'
                              ? isDark
                                ? 'rgba(239, 68, 68, 0.2)'
                                : 'rgba(239, 68, 68, 0.1)'
                              : isDark
                              ? 'rgba(16, 185, 129, 0.2)'
                              : 'rgba(16, 185, 129, 0.1)',
                          color:
                            (pos.tag || 'OPEN').toUpperCase() === 'CLOSED'
                              ? isDark
                                ? '#F87171'
                                : '#DC2626'
                              : isDark
                              ? '#34D399'
                              : '#059669',
                          border: '1px solid',
                          borderColor:
                            (pos.tag || 'OPEN').toUpperCase() === 'CLOSED'
                              ? isDark
                                ? 'rgba(239, 68, 68, 0.4)'
                                : 'rgba(239, 68, 68, 0.3)'
                              : isDark
                              ? 'rgba(16, 185, 129, 0.4)'
                              : 'rgba(16, 185, 129, 0.3)',
                        }}
                      />
                    </Box>
                    <Tooltip title="Delete Position">
                      <IconButton size="small" color="error" onClick={() => handleDeletePosition(index)}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={2.5}>
                      <Grid item xs={12} sm={5}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Role Title"
                          value={pos.role || ''}
                          onChange={(e) => handlePositionChange(index, 'role', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Terms / Duration"
                          placeholder="e.g., Full-time · Competitive Stipend"
                          value={pos.terms || ''}
                          onChange={(e) => handlePositionChange(index, 'terms', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel id={`pos-status-label-${index}`}>Position Status</InputLabel>
                          <Select
                            labelId={`pos-status-label-${index}`}
                            label="Position Status"
                            value={(pos.tag || 'OPEN').toUpperCase() === 'CLOSED' ? 'CLOSED' : 'OPEN'}
                            onChange={(e) => handlePositionChange(index, 'tag', e.target.value)}
                            sx={{
                              fontWeight: 700,
                              color:
                                (pos.tag || 'OPEN').toUpperCase() === 'CLOSED'
                                  ? isDark
                                    ? '#F87171'
                                    : '#DC2626'
                                  : isDark
                                  ? '#34D399'
                                  : '#059669',
                            }}
                          >
                            <MenuItem value="OPEN" sx={{ fontWeight: 700, color: '#10B981' }}>
                              🟢 Open (Accepting)
                            </MenuItem>
                            <MenuItem value="CLOSED" sx={{ fontWeight: 700, color: '#EF4444' }}>
                              🔴 Closed (Unavailable)
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          size="small"
                          label="Research Focus & Requirements"
                          value={pos.focus || ''}
                          onChange={(e) => handlePositionChange(index, 'focus', e.target.value)}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}

        {/* Tab 2: Application Instructions & Checklist */}
        {tabValue === 2 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
            {/* Instructions Header */}
            <Card
              sx={{
                borderRadius: '16px',
                backgroundColor: isDark ? 'rgba(15, 21, 35, 0.75)' : '#FFFFFF',
                border: '1px solid',
                borderColor: theme.palette.divider,
              }}
            >
              <Box
                sx={{
                  px: 3,
                  py: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  backgroundColor: isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(37, 99, 235, 0.04)',
                  borderBottom: '1px solid',
                  borderColor: theme.palette.divider,
                }}
              >
                <SchoolOutlinedIcon sx={{ color: isDark ? '#60A5FA' : '#2563EB' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Application Instructions Heading
                </Typography>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Instructions Title"
                      value={content.applicationInstructions.title}
                      onChange={(e) => handleInstructionsMetaChange('title', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Recipient Email"
                      value={content.applicationInstructions.contactEmail || ''}
                      onChange={(e) => handleInstructionsMetaChange('contactEmail', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Introduction Text"
                      value={content.applicationInstructions.description}
                      onChange={(e) => handleInstructionsMetaChange('description', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Default Email Subject"
                      value={content.applicationInstructions.emailSubject || ''}
                      onChange={(e) => handleInstructionsMetaChange('emailSubject', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Action Button Label"
                      value={content.applicationInstructions.buttonText || ''}
                      onChange={(e) => handleInstructionsMetaChange('buttonText', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Checklist Items */}
            <Card
              sx={{
                borderRadius: '16px',
                backgroundColor: isDark ? 'rgba(15, 21, 35, 0.75)' : '#FFFFFF',
                border: '1px solid',
                borderColor: theme.palette.divider,
              }}
            >
              <Box
                sx={{
                  px: 3,
                  py: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(37, 99, 235, 0.04)',
                  borderBottom: '1px solid',
                  borderColor: theme.palette.divider,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <FormatListBulletedOutlinedIcon sx={{ color: isDark ? '#60A5FA' : '#2563EB' }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Required Application Documents ({content.applicationInstructions.checklist?.length || 0})
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={handleAddChecklistItem}
                  sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
                >
                  + Add Item
                </Button>
              </Box>

              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {(content.applicationInstructions.checklist || []).map((item, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label={`Checklist Item #${idx + 1}`}
                        value={item}
                        onChange={(e) => handleChecklistChange(idx, e.target.value)}
                      />
                      <Tooltip title="Delete Item">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteChecklistItem(idx)}
                          disabled={content.applicationInstructions.checklist.length <= 1}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}
      </SectionWrapper>
    </Box>
  );
};

export default AdminOpportunities;
